/**
 * Supabase Storage Service
 * Handles image uploads to Supabase Storage
 */

const { supabase } = require('./supabase-config');
const fs = require('fs').promises;
const path = require('path');

// Upload image to Supabase Storage
async function uploadImage(file, folder = 'products') {
    try {
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
        // Determine bucket name based on folder
        const bucketName = folder === 'blogs' ? 'blogs' : 'products';
        
        // Read file buffer
        const fileBuffer = await fs.readFile(file.path);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(filePath, fileBuffer, {
                contentType: file.mimetype,
                upsert: false
            });
        
        if (error) {
            throw error;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);
        
        // Clean up local file
        await fs.unlink(file.path).catch(() => {});
        
        return {
            url: urlData.publicUrl,
            path: filePath
        };
    } catch (error) {
        console.error('Error uploading image to Supabase:', error);
        throw error;
    }
}

// Upload multiple images
async function uploadImages(files, folder = 'products') {
    try {
        const uploadPromises = files.map(file => uploadImage(file, folder));
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
}

// Delete image from Supabase Storage
async function deleteImage(imagePath, bucketName = 'products') {
    try {
        // Extract bucket name from path if it contains folder structure
        if (imagePath.includes('products/')) {
            bucketName = 'products';
        } else if (imagePath.includes('blogs/')) {
            bucketName = 'blogs';
        }
        
        const { error } = await supabase.storage
            .from(bucketName)
            .remove([imagePath]);
        
        if (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
        
        return true;
    } catch (error) {
        console.error('Error deleting image from Supabase:', error);
        return false;
    }
}

// Extract path from URL
function extractPathFromUrl(url) {
    try {
        // Extract path from Supabase Storage URL
        // Format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
        const match = url.match(/\/(products|blogs)\/(.+)$/);
        if (match) {
            return match[2]; // Return just the path part
        }
        return null;
    } catch (error) {
        return null;
    }
}

module.exports = {
    uploadImage,
    uploadImages,
    deleteImage,
    extractPathFromUrl
};

