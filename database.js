/**
 * Database Service - Supabase PostgreSQL
 * Handles all database operations using Supabase
 */

const { pool, supabase } = require('./supabase-config');

// ==================== PRODUCT OPERATIONS ====================

async function getAllProducts() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'image_url', pi.image_url,
                            'image_path', pi.image_path,
                            'display_order', pi.display_order
                        ) ORDER BY pi.display_order
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'::json
                ) as images
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        `);
        
        // Transform the result to match expected format
        return result.rows.map(row => {
            const product = {
                id: row.id,
                name: row.name,
                category: row.category,
                description: row.description,
                price: parseFloat(row.price) || 0,
                originalPrice: row.original_price ? parseFloat(row.original_price) : null,
                discountPrice: row.discount_price ? parseFloat(row.discount_price) : null,
                stock: parseInt(row.stock) || 0,
                isActive: row.is_active !== false,
                specifications: row.specifications || {},
                supplier: row.supplier || 'BABISHA Collections',
                rating: parseFloat(row.rating) || 0,
                reviews: parseInt(row.reviews) || 0,
                onSale: row.on_sale || false,
                savings: row.savings ? parseFloat(row.savings) : null,
                createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
                updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
            };
            
            // Handle images array
            if (row.images && Array.isArray(row.images) && row.images.length > 0) {
                product.images = row.images.map(img => img.image_url || img).filter(Boolean);
            } else {
                product.images = [];
            }
            
            return product;
        });
    } finally {
        client.release();
    }
}

async function getProductById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT 
                p.*,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', pi.id,
                            'image_url', pi.image_url,
                            'image_path', pi.image_path,
                            'display_order', pi.display_order
                        ) ORDER BY pi.display_order
                    ) FILTER (WHERE pi.id IS NOT NULL),
                    '[]'::json
                ) as images
            FROM products p
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.id = $1
            GROUP BY p.id
        `, [id]);
        
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        const product = {
            id: row.id,
            name: row.name,
            category: row.category,
            description: row.description,
            price: parseFloat(row.price) || 0,
            originalPrice: row.original_price ? parseFloat(row.original_price) : null,
            discountPrice: row.discount_price ? parseFloat(row.discount_price) : null,
            stock: parseInt(row.stock) || 0,
            isActive: row.is_active !== false,
            specifications: row.specifications || {},
            supplier: row.supplier || 'BABISHA Collections',
            rating: parseFloat(row.rating) || 0,
            reviews: parseInt(row.reviews) || 0,
            onSale: row.on_sale || false,
            savings: row.savings ? parseFloat(row.savings) : null,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString()
        };
        
        // Handle images array
        if (row.images && Array.isArray(row.images) && row.images.length > 0) {
            product.images = row.images.map(img => img.image_url || img).filter(Boolean);
        } else {
            product.images = [];
        }
        
        return product;
    } finally {
        client.release();
    }
}

async function createProduct(productData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const productResult = await client.query(`
            INSERT INTO products (
                name, category, description, price, original_price, discount_price,
                stock, is_active, specifications, supplier, rating, reviews,
                on_sale, savings
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `, [
            productData.name,
            productData.category,
            productData.description,
            productData.price,
            productData.originalPrice || null,
            productData.discountPrice || null,
            productData.stock || 0,
            productData.isActive !== false,
            JSON.stringify(productData.specifications || {}),
            productData.supplier || 'BABISHA Collections',
            productData.rating || 0,
            productData.reviews || 0,
            productData.onSale || false,
            productData.savings || null
        ]);
        
        const product = productResult.rows[0];
        
        // Insert images if provided
        if (productData.images && productData.images.length > 0) {
            for (let i = 0; i < productData.images.length; i++) {
                let imageUrl, imagePath;
                
                // Handle both formats: string URLs or objects with url/path
                if (typeof productData.images[i] === 'string') {
                    imageUrl = productData.images[i];
                    // Extract path from URL if it's a local URL
                    if (imageUrl.includes('/uploads/')) {
                        imagePath = imageUrl.replace('http://localhost:3001', '').replace('http://127.0.0.1:3001', '');
                    } else {
                        imagePath = imageUrl; // For external URLs, use URL as path
                    }
                } else if (productData.images[i] && typeof productData.images[i] === 'object') {
                    imageUrl = productData.images[i].url || productData.images[i];
                    imagePath = productData.images[i].path || imageUrl;
                } else {
                    imageUrl = String(productData.images[i]);
                    imagePath = imageUrl;
                }
                
                await client.query(`
                    INSERT INTO product_images (product_id, image_url, image_path, display_order)
                    VALUES ($1, $2, $3, $4)
                `, [product.id, imageUrl, imagePath, i]);
            }
        }
        
        await client.query('COMMIT');
        
        // Fetch complete product with images
        return await getProductById(product.id);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateProduct(id, productData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const updateResult = await client.query(`
            UPDATE products SET
                name = COALESCE($1, name),
                category = COALESCE($2, category),
                description = COALESCE($3, description),
                price = COALESCE($4, price),
                original_price = COALESCE($5, original_price),
                discount_price = COALESCE($6, discount_price),
                stock = COALESCE($7, stock),
                is_active = COALESCE($8, is_active),
                specifications = COALESCE($9::jsonb, specifications),
                supplier = COALESCE($10, supplier),
                rating = COALESCE($11, rating),
                reviews = COALESCE($12, reviews),
                on_sale = COALESCE($13, on_sale),
                savings = COALESCE($14, savings),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $15
            RETURNING *
        `, [
            productData.name,
            productData.category,
            productData.description,
            productData.price,
            productData.originalPrice,
            productData.discountPrice,
            productData.stock,
            productData.isActive,
            productData.specifications ? JSON.stringify(productData.specifications) : null,
            productData.supplier,
            productData.rating,
            productData.reviews,
            productData.onSale,
            productData.savings,
            id
        ]);
        
        if (updateResult.rows.length === 0) {
            throw new Error('Product not found');
        }
        
        // Update images if provided
        if (productData.images !== undefined) {
            // Delete existing images
            await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
            
            // Insert new images
            if (productData.images.length > 0) {
                for (let i = 0; i < productData.images.length; i++) {
                    const imageUrl = typeof productData.images[i] === 'string' 
                        ? productData.images[i] 
                        : productData.images[i].url || productData.images[i];
                    const imagePath = typeof productData.images[i] === 'string'
                        ? productData.images[i]
                        : productData.images[i].path || imageUrl;
                    
                    await client.query(`
                        INSERT INTO product_images (product_id, image_url, image_path, display_order)
                        VALUES ($1, $2, $3, $4)
                    `, [id, imageUrl, imagePath, i]);
                }
            }
        }
        
        await client.query('COMMIT');
        
        return await getProductById(id);
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function deleteProduct(id) {
    const client = await pool.connect();
    try {
        // Cascade delete will handle product_images
        const result = await client.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
        return result.rows.length > 0;
    } finally {
        client.release();
    }
}

// ==================== BLOG OPERATIONS ====================

async function getAllBlogs() {
    const client = await pool.connect();
    try {
        const result = await client.query(`
            SELECT * FROM blogs
            ORDER BY created_at DESC
        `);
        
        return result.rows.map(row => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            featuredImage: row.featured_image_url,
            featuredImageUrl: row.featured_image_url,
            featuredImagePath: row.featured_image_path,
            metaTitle: row.meta_title,
            metaDescription: row.meta_description,
            status: row.status,
            author: row.author,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
            publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null
        }));
    } finally {
        client.release();
    }
}

async function getBlogById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        return {
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            featuredImage: row.featured_image_url,
            featuredImageUrl: row.featured_image_url,
            featuredImagePath: row.featured_image_path,
            metaTitle: row.meta_title,
            metaDescription: row.meta_description,
            status: row.status,
            author: row.author,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
            publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null
        };
    } finally {
        client.release();
    }
}

async function getBlogBySlug(slug) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM blogs WHERE slug = $1', [slug]);
        if (result.rows.length === 0) return null;
        
        const row = result.rows[0];
        return {
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            featuredImage: row.featured_image_url,
            featuredImageUrl: row.featured_image_url,
            featuredImagePath: row.featured_image_path,
            metaTitle: row.meta_title,
            metaDescription: row.meta_description,
            status: row.status,
            author: row.author,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
            publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null
        };
    } finally {
        client.release();
    }
}

async function createBlog(blogData) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const result = await client.query(`
            INSERT INTO blogs (
                title, slug, content, excerpt, featured_image_url, featured_image_path,
                meta_title, meta_description, status, author, published_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [
            blogData.title || 'Untitled Blog',
            blogData.slug || 'untitled-blog',
            blogData.content || '',
            blogData.excerpt || '',
            blogData.featuredImageUrl || null,
            blogData.featuredImagePath || null,
            blogData.metaTitle || blogData.title || 'Untitled Blog',
            blogData.metaDescription || blogData.excerpt || '',
            blogData.status || 'draft',
            blogData.author || 'Admin',
            blogData.status === 'published' ? new Date() : null
        ]);
        
        await client.query('COMMIT');
        
        const row = result.rows[0];
        return {
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            featuredImage: row.featured_image_url,
            featuredImageUrl: row.featured_image_url,
            featuredImagePath: row.featured_image_path,
            metaTitle: row.meta_title,
            metaDescription: row.meta_description,
            status: row.status,
            author: row.author,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
            publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null
        };
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

async function updateBlog(id, blogData) {
    const client = await pool.connect();
    try {
        const existingBlog = await getBlogById(id);
        if (!existingBlog) {
            throw new Error('Blog not found');
        }
        
        const result = await client.query(`
            UPDATE blogs SET
                title = COALESCE($1, title),
                slug = COALESCE($2, slug),
                content = COALESCE($3, content),
                excerpt = COALESCE($4, excerpt),
                featured_image_url = COALESCE($5, featured_image_url),
                featured_image_path = COALESCE($6, featured_image_path),
                meta_title = COALESCE($7, meta_title),
                meta_description = COALESCE($8, meta_description),
                status = COALESCE($9, status),
                published_at = CASE 
                    WHEN $9 = 'published' AND status = 'draft' THEN CURRENT_TIMESTAMP
                    ELSE published_at
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING *
        `, [
            blogData.title,
            blogData.slug,
            blogData.content,
            blogData.excerpt,
            blogData.featuredImageUrl,
            blogData.featuredImagePath,
            blogData.metaTitle,
            blogData.metaDescription,
            blogData.status,
            id
        ]);
        
        const row = result.rows[0];
        return {
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            featuredImage: row.featured_image_url,
            featuredImageUrl: row.featured_image_url,
            featuredImagePath: row.featured_image_path,
            metaTitle: row.meta_title,
            metaDescription: row.meta_description,
            status: row.status,
            author: row.author,
            createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
            updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
            publishedAt: row.published_at ? new Date(row.published_at).toISOString() : null
        };
    } finally {
        client.release();
    }
}

async function deleteBlog(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);
        return result.rows.length > 0;
    } finally {
        client.release();
    }
}

// ==================== ADMIN USER OPERATIONS ====================

async function getAdminUserByEmail(email) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM admin_users WHERE email = $1', [email]);
        return result.rows[0] || null;
    } finally {
        client.release();
    }
}

async function getAdminUserById(id) {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM admin_users WHERE id = $1', [id]);
        return result.rows[0] || null;
    } finally {
        client.release();
    }
}

// ==================== ADMIN INITIALIZATION ====================

async function initializeAdmin() {
    const client = await pool.connect();
    try {
        // Check if admin user exists
        const existingAdmin = await client.query(
            'SELECT * FROM admin_users WHERE email = $1',
            ['admin@babisha.com']
        );
        
        if (existingAdmin.rows.length === 0) {
            // Create default admin user (password: admin123)
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await client.query(`
                INSERT INTO admin_users (email, password, name, role)
                VALUES ($1, $2, $3, $4)
            `, ['admin@babisha.com', hashedPassword, 'Admin User', 'admin']);
            
            console.log('✅ Default admin user created');
        } else {
            console.log('✅ Admin user already exists');
        }
    } catch (error) {
        console.warn('⚠️ Admin initialization warning:', error.message);
        // Don't throw - admin might already exist
    } finally {
        client.release();
    }
}

// ==================== DASHBOARD STATS ====================

async function getDashboardStats() {
    const client = await pool.connect();
    try {
        const productsResult = await client.query(`
            SELECT 
                COUNT(*) as total_products,
                COUNT(*) FILTER (WHERE is_active = true) as active_products,
                COALESCE(SUM(price), 0) as revenue
            FROM products
        `);
        
        const blogsResult = await client.query(`
            SELECT 
                COUNT(*) as total_blogs,
                COUNT(*) FILTER (WHERE status = 'published') as published_blogs
            FROM blogs
        `);
        
        const stats = productsResult.rows[0];
        const blogStats = blogsResult.rows[0];
        
        return {
            totalDresses: parseInt(stats.total_products) || 0,
            totalBlogs: parseInt(blogStats.total_blogs) || 0,
            activeProducts: parseInt(stats.active_products) || 0,
            publishedBlogs: parseInt(blogStats.published_blogs) || 0,
            revenue: parseFloat(stats.revenue) || 0
        };
    } finally {
        client.release();
    }
}

module.exports = {
    // Products
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Blogs
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    
    // Admin
    getAdminUserByEmail,
    getAdminUserById,
    initializeAdmin,
    
    // Dashboard
    getDashboardStats,
    
    // Supabase client and pool for storage
    supabase,
    pool
};

