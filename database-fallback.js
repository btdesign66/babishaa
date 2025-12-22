/**
 * Database Fallback - Uses JSON files if Supabase is not configured
 * This allows the admin panel to work even without Supabase setup
 */

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating data directory:', error);
    }
}

// Read JSON file
async function readJSONFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return filename === 'products.json' ? [] : filename === 'blogs.json' ? [] : { users: [] };
        }
        throw error;
    }
}

// Write JSON file
async function writeJSONFile(filename, data) {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// ==================== PRODUCT OPERATIONS ====================

async function getAllProducts() {
    const products = await readJSONFile('products.json');
    return products.map(p => ({
        ...p,
        images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : [])
    }));
}

async function getProductById(id) {
    const products = await readJSONFile('products.json');
    const product = products.find(p => p.id === id);
    if (!product) return null;
    
    return {
        ...product,
        images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : [])
    };
}

async function createProduct(productData) {
    const products = await readJSONFile('products.json');
    
    const newProduct = {
        id: uuidv4(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    await writeJSONFile('products.json', products);
    return newProduct;
}

async function updateProduct(id, productData) {
    const products = await readJSONFile('products.json');
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
        throw new Error('Product not found');
    }
    
    products[index] = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString()
    };
    
    await writeJSONFile('products.json', products);
    return products[index];
}

async function deleteProduct(id) {
    const products = await readJSONFile('products.json');
    const filtered = products.filter(p => p.id !== id);
    await writeJSONFile('products.json', filtered);
    return true;
}

// ==================== BLOG OPERATIONS ====================

async function getAllBlogs() {
    return await readJSONFile('blogs.json');
}

async function getBlogById(id) {
    const blogs = await readJSONFile('blogs.json');
    return blogs.find(b => b.id === id) || null;
}

async function getBlogBySlug(slug) {
    const blogs = await readJSONFile('blogs.json');
    return blogs.find(b => b.slug === slug) || null;
}

async function createBlog(blogData) {
    const blogs = await readJSONFile('blogs.json');
    
    const newBlog = {
        id: uuidv4(),
        ...blogData,
        featuredImage: blogData.featuredImageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: blogData.status === 'published' ? new Date().toISOString() : null
    };
    
    blogs.push(newBlog);
    await writeJSONFile('blogs.json', blogs);
    return newBlog;
}

async function updateBlog(id, blogData) {
    const blogs = await readJSONFile('blogs.json');
    const index = blogs.findIndex(b => b.id === id);
    
    if (index === -1) {
        throw new Error('Blog not found');
    }
    
    const existing = blogs[index];
    blogs[index] = {
        ...existing,
        ...blogData,
        featuredImage: blogData.featuredImageUrl || existing.featuredImage,
        updatedAt: new Date().toISOString(),
        publishedAt: (existing.status === 'draft' && blogData.status === 'published') 
            ? new Date().toISOString() 
            : existing.publishedAt
    };
    
    await writeJSONFile('blogs.json', blogs);
    return blogs[index];
}

async function deleteBlog(id) {
    const blogs = await readJSONFile('blogs.json');
    const filtered = blogs.filter(b => b.id !== id);
    await writeJSONFile('blogs.json', filtered);
    return true;
}

// ==================== ADMIN USER OPERATIONS ====================

async function getAdminUserByEmail(email) {
    const adminData = await readJSONFile('admin.json');
    return adminData.users.find(u => u.email === email) || null;
}

async function getAdminUserById(id) {
    const adminData = await readJSONFile('admin.json');
    return adminData.users.find(u => u.id === id) || null;
}

// ==================== DASHBOARD STATS ====================

async function getDashboardStats() {
    const products = await readJSONFile('products.json');
    const blogs = await readJSONFile('blogs.json');
    
    return {
        totalDresses: products.length,
        totalBlogs: blogs.length,
        activeProducts: products.filter(p => p.isActive !== false).length,
        publishedBlogs: blogs.filter(b => b.status === 'published').length,
        revenue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
    };
}

// Mock pool for compatibility
const mockPool = {
    query: async () => ({ rows: [] }),
    connect: async () => ({
        query: async () => ({ rows: [] }),
        release: () => {}
    })
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getAdminUserByEmail,
    getAdminUserById,
    getDashboardStats,
    pool: mockPool, // Mock pool for compatibility
    supabase: null // No Supabase in fallback mode
};

