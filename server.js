/**
 * BABISHA Admin Panel - Backend Server
 * Express.js server with authentication and CRUD APIs
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

// Database - Supabase with JSON fallback
let db, storage;
let useSupabase = false;

// Initialize database with fallback
async function initializeDatabase() {
    try {
        // Try to load Supabase modules
        const supabaseDb = require('./database');
        const supabaseStorage = require('./storage-service');
        
        // Test database connection with timeout
        try {
            const testQuery = Promise.race([
                supabaseDb.pool.query('SELECT NOW()'),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
            ]);
            
            await testQuery;
            db = supabaseDb;
            storage = supabaseStorage;
            useSupabase = true;
            console.log('✅ Using Supabase PostgreSQL database');
            
            // Test Supabase Storage
            try {
                const { data: buckets, error: storageErr } = await supabaseDb.supabase.storage.listBuckets();
                if (storageErr) throw storageErr;
                console.log('✅ Supabase Storage connected');
            } catch (storageErr) {
                console.warn('⚠️ Supabase Storage not available, using local storage');
                console.warn('   Error:', storageErr.message);
            }
        } catch (dbErr) {
            console.warn('⚠️ Supabase database connection failed, using JSON file fallback');
            console.warn('   Error:', dbErr.message);
            console.warn('   The admin panel will work with local JSON storage');
            db = require('./database-fallback');
            storage = null;
            useSupabase = false;
        }
    } catch (error) {
        console.warn('⚠️ Supabase modules not available, using JSON file fallback');
        console.warn('   Error:', error.message);
        db = require('./database-fallback');
        storage = null;
        useSupabase = false;
    }
    
    // Ensure db is always set (double-check fallback)
    if (!db) {
        console.warn('⚠️ Database not initialized, forcing fallback...');
        db = require('./database-fallback');
        storage = null;
        useSupabase = false;
    }
    
    return { db, storage, useSupabase };
}

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'babisha-admin-secret-key-change-in-production';

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:8000',
            'http://127.0.0.1:8000',
            'http://localhost:3001',
            'http://127.0.0.1:3001'
        ];
        
        // Allow if origin is in the list, or if it's from the same origin (for production)
        if (allowedOrigins.indexOf(origin) !== -1 || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        } else {
            // For production, allow same-origin requests
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static files from root (for index.html, products.html, etc.)
app.use(express.static(__dirname));
// Serve admin panel static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'products');
const BLOG_UPLOADS_DIR = path.join(__dirname, 'uploads', 'blogs');

async function ensureDirectories() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
        await fs.mkdir(BLOG_UPLOADS_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating directories:', error);
    }
}

// Configure multer for file uploads
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = req.path.includes('/blogs') ? BLOG_UPLOADS_DIR : UPLOADS_DIR;
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: multerStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

// Helper function to read JSON file
async function readJSONFile(filename) {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Return default empty structure if file doesn't exist
        if (error.code === 'ENOENT') {
            return getDefaultData(filename);
        }
        throw error;
    }
}

// Helper function to write JSON file
async function writeJSONFile(filename, data) {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Default data structures
function getDefaultData(filename) {
    if (filename === 'products.json') {
        return [];
    } else if (filename === 'blogs.json') {
        return [];
    } else if (filename === 'admin.json') {
        return {
            users: []
        };
    }
    return {};
}

// Initialize default admin user
async function initializeAdmin() {
    const adminData = await readJSONFile('admin.json');
    if (adminData.users.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        adminData.users.push({
            id: uuidv4(),
            email: 'admin@babisha.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        await writeJSONFile('admin.json', adminData);
        console.log('Default admin user created: admin@babisha.com / admin123');
    }
}

// ==================== AUTHENTICATION ROUTES ====================

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await db.getAdminUserByEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify Token
app.get('/api/admin/verify', authenticateToken, async (req, res) => {
    try {
        const user = await db.getAdminUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== DASHBOARD ROUTES ====================

// Get Dashboard Stats
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const stats = await db.getDashboardStats();
        res.json({
            ...stats,
            revenue: stats.revenue.toFixed(2)
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== PRODUCT ROUTES ====================

// Get All Products
app.get('/api/admin/products', authenticateToken, async (req, res) => {
    try {
        const products = await db.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Single Product
app.get('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const product = await db.getProductById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Product
app.post('/api/admin/products', authenticateToken, upload.array('images', 10), async (req, res) => {
    try {
        console.log('Creating product...', req.body);
        
        // Upload images to Supabase Storage or use local paths
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            if (useSupabase && storage) {
                try {
                    const uploadResults = await storage.uploadImages(req.files, 'products');
                    imageUrls = uploadResults.map(result => result.url);
                } catch (storageError) {
                    console.warn('Supabase Storage upload failed, using local paths:', storageError.message);
                    // Fallback to local paths
                    imageUrls = req.files.map(file => `http://localhost:3001/uploads/products/${file.filename}`);
                }
            } else {
                // Use local file paths
                imageUrls = req.files.map(file => `http://localhost:3001/uploads/products/${file.filename}`);
            }
        }
        
        // Parse specifications safely
        let specifications = {};
        try {
            if (req.body.specifications) {
                specifications = typeof req.body.specifications === 'string' 
                    ? JSON.parse(req.body.specifications) 
                    : req.body.specifications;
            }
        } catch (e) {
            console.warn('Invalid specifications JSON, using empty object');
        }
        
        const productData = {
            name: req.body.name || 'Untitled Product',
            category: req.body.category || 'Uncategorized',
            description: req.body.description || '',
            price: parseFloat(req.body.price) || 0,
            originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
            discountPrice: req.body.discountPrice ? parseFloat(req.body.discountPrice) : null,
            images: imageUrls,
            stock: parseInt(req.body.stock) || 0,
            isActive: req.body.isActive === 'true' || req.body.isActive === true || req.body.isActive === '1',
            specifications: specifications,
            supplier: req.body.supplier || 'BABISHA Collections',
            rating: parseFloat(req.body.rating) || 0,
            reviews: parseInt(req.body.reviews) || 0,
            onSale: req.body.onSale === 'true' || req.body.onSale === true || req.body.onSale === '1',
            savings: req.body.savings ? parseFloat(req.body.savings) : null
        };

        console.log('Product data:', productData);
        const newProduct = await db.createProduct(productData);
        console.log('Product created successfully:', newProduct.id);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Create product error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Update Product
app.put('/api/admin/products/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
    try {
        const existingProduct = await db.getProductById(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        let imageUrls = existingProduct.images || [];

        // Upload new images if provided
        if (req.files && req.files.length > 0) {
            if (useSupabase && storage) {
                try {
                    const uploadResults = await storage.uploadImages(req.files, 'products');
                    const newImageUrls = uploadResults.map(result => result.url);
                    imageUrls = [...imageUrls, ...newImageUrls];
                } catch (storageError) {
                    console.warn('Supabase Storage upload failed, using local paths:', storageError.message);
                    const newImageUrls = req.files.map(file => `http://localhost:3001/uploads/products/${file.filename}`);
                    imageUrls = [...imageUrls, ...newImageUrls];
                }
            } else {
                const newImageUrls = req.files.map(file => `http://localhost:3001/uploads/products/${file.filename}`);
                imageUrls = [...imageUrls, ...newImageUrls];
            }
        }
        
        // Parse specifications safely
        let specifications = existingProduct.specifications || {};
        try {
            if (req.body.specifications) {
                specifications = typeof req.body.specifications === 'string' 
                    ? JSON.parse(req.body.specifications) 
                    : req.body.specifications;
            }
        } catch (e) {
            console.warn('Invalid specifications JSON, keeping existing');
        }

        const productData = {
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: req.body.price ? parseFloat(req.body.price) : undefined,
            originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
            discountPrice: req.body.discountPrice ? parseFloat(req.body.discountPrice) : undefined,
            images: imageUrls,
            stock: req.body.stock !== undefined ? parseInt(req.body.stock) : undefined,
            isActive: req.body.isActive !== undefined ? (req.body.isActive === 'true' || req.body.isActive === true) : undefined,
            specifications: specifications,
            supplier: req.body.supplier,
            rating: req.body.rating ? parseFloat(req.body.rating) : undefined,
            reviews: req.body.reviews ? parseInt(req.body.reviews) : undefined,
            onSale: req.body.onSale !== undefined ? (req.body.onSale === 'true' || req.body.onSale === true) : undefined,
            savings: req.body.savings ? parseFloat(req.body.savings) : undefined
        };

        const updatedProduct = await db.updateProduct(req.params.id, productData);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Delete Product
app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
    try {
        const product = await db.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Delete images from Supabase Storage (if using Supabase)
        if (useSupabase && storage && product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                try {
                    const imagePath = storage.extractPathFromUrl(imageUrl);
                    if (imagePath) {
                        await storage.deleteImage(imagePath);
                    }
                } catch (err) {
                    console.warn('Error deleting image from storage:', err.message);
                }
            }
        }
        
        await db.deleteProduct(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Product Image
app.delete('/api/admin/products/:id/images/:imageIndex', authenticateToken, async (req, res) => {
    try {
        const product = await db.getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageIndex = parseInt(req.params.imageIndex);
        if (product.images && product.images[imageIndex]) {
            const imageUrl = product.images[imageIndex];
            
            // Delete from storage if using Supabase
            if (useSupabase && storage) {
                try {
                    const imagePath = storage.extractPathFromUrl(imageUrl);
                    if (imagePath) {
                        await storage.deleteImage(imagePath);
                    }
                } catch (err) {
                    console.warn('Error deleting image from storage:', err.message);
                }
            } else {
                // Delete local file
                try {
                    const imagePath = path.join(__dirname, imageUrl.replace('http://localhost:3001', ''));
                    await fs.unlink(imagePath);
                } catch (err) {
                    console.warn('Error deleting local image file:', err.message);
                }
            }
            
            // Remove from array
            product.images.splice(imageIndex, 1);
            
            // Update product
            const updatedProduct = await db.updateProduct(req.params.id, { images: product.images });
            res.json({ message: 'Image deleted successfully', product: updatedProduct });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// ==================== BLOG ROUTES ====================

// Get All Blogs
app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
    try {
        const blogs = await db.getAllBlogs();
        res.json(blogs);
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Single Blog
app.get('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const blog = await db.getBlogById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create Blog
app.post('/api/admin/blogs', authenticateToken, upload.single('featuredImage'), async (req, res) => {
    try {
        console.log('Creating blog...', req.body);
        
        let featuredImageUrl = null;
        let featuredImagePath = null;
        
        // Upload featured image to Supabase Storage or use local path
        if (req.file) {
            if (useSupabase && storage) {
                try {
                    const uploadResult = await storage.uploadImage(req.file, 'blogs');
                    featuredImageUrl = uploadResult.url;
                    featuredImagePath = uploadResult.path;
                } catch (storageError) {
                    console.warn('Supabase Storage upload failed, using local path:', storageError.message);
                    featuredImageUrl = `http://localhost:3001/uploads/blogs/${req.file.filename}`;
                    featuredImagePath = `/uploads/blogs/${req.file.filename}`;
                }
            } else {
                featuredImageUrl = `http://localhost:3001/uploads/blogs/${req.file.filename}`;
                featuredImagePath = `/uploads/blogs/${req.file.filename}`;
            }
        }
        
        const blogData = {
            title: req.body.title || 'Untitled Blog',
            slug: req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/\s+/g, '-') : 'untitled-blog'),
            content: req.body.content || '',
            excerpt: req.body.excerpt || (req.body.content ? req.body.content.substring(0, 200) : ''),
            featuredImageUrl: featuredImageUrl,
            featuredImagePath: featuredImagePath,
            metaTitle: req.body.metaTitle || req.body.title || 'Untitled Blog',
            metaDescription: req.body.metaDescription || req.body.excerpt || (req.body.content ? req.body.content.substring(0, 160) : ''),
            status: req.body.status || 'draft',
            author: req.user.name || 'Admin'
        };

        console.log('Blog data:', blogData);
        const newBlog = await db.createBlog(blogData);
        console.log('Blog created successfully:', newBlog.id);
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Create blog error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Update Blog
app.put('/api/admin/blogs/:id', authenticateToken, upload.single('featuredImage'), async (req, res) => {
    try {
        const existingBlog = await db.getBlogById(req.params.id);
        if (!existingBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        let featuredImageUrl = existingBlog.featured_image_url;
        let featuredImagePath = existingBlog.featured_image_path;

        // Update featured image if new one uploaded
        if (req.file) {
            if (useSupabase && storage) {
                try {
                    // Delete old image from Supabase Storage
                    if (existingBlog.featured_image_path) {
                        await storage.deleteImage(existingBlog.featured_image_path, 'blogs');
                    }
                    
                    // Upload new image
                    const uploadResult = await storage.uploadImage(req.file, 'blogs');
                    featuredImageUrl = uploadResult.url;
                    featuredImagePath = uploadResult.path;
                } catch (storageError) {
                    console.warn('Supabase Storage upload failed, using local path:', storageError.message);
                    featuredImageUrl = `http://localhost:3001/uploads/blogs/${req.file.filename}`;
                    featuredImagePath = `/uploads/blogs/${req.file.filename}`;
                }
            } else {
                featuredImageUrl = `http://localhost:3001/uploads/blogs/${req.file.filename}`;
                featuredImagePath = `/uploads/blogs/${req.file.filename}`;
            }
        }

        const blogData = {
            title: req.body.title,
            slug: req.body.slug,
            content: req.body.content,
            excerpt: req.body.excerpt,
            featuredImageUrl: featuredImageUrl,
            featuredImagePath: featuredImagePath,
            metaTitle: req.body.metaTitle,
            metaDescription: req.body.metaDescription,
            status: req.body.status
        };

        const updatedBlog = await db.updateBlog(req.params.id, blogData);
        res.json(updatedBlog);
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Delete Blog
app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
    try {
        const blog = await db.getBlogById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        // Delete featured image from Supabase Storage (if using Supabase)
        if (useSupabase && storage && blog.featured_image_path) {
            try {
                await storage.deleteImage(blog.featured_image_path, 'blogs');
            } catch (err) {
                console.warn('Error deleting image from storage:', err.message);
            }
        }
        
        await db.deleteBlog(req.params.id);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== PUBLIC API ROUTES (for frontend) ====================

// Get Active Products (Public)
app.get('/api/products', async (req, res) => {
    try {
        const allProducts = await db.getAllProducts();
        const activeProducts = allProducts.filter(p => p.isActive !== false);
        res.json(activeProducts);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Published Blogs (Public)
app.get('/api/blogs', async (req, res) => {
    try {
        const allBlogs = await db.getAllBlogs();
        const publishedBlogs = allBlogs.filter(b => b.status === 'published');
        res.json(publishedBlogs);
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get Single Blog (Public)
app.get('/api/blogs/:slug', async (req, res) => {
    try {
        const blog = await db.getBlogBySlug(req.params.slug);
        
        if (!blog || blog.status !== 'published') {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json(blog);
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Initialize server
async function startServer() {
    try {
        await ensureDirectories();
        
        // Initialize database (with fallback)
        const dbInit = await initializeDatabase();
        db = dbInit.db;
        storage = dbInit.storage;
        useSupabase = dbInit.useSupabase;
        
        // Initialize admin user
        try {
            if (typeof db.initializeAdmin === 'function') {
                await db.initializeAdmin();
            } else if (!useSupabase) {
                // Use server's initializeAdmin for fallback
                await initializeAdmin();
            }
        } catch (adminErr) {
            console.warn('⚠️ Admin initialization warning:', adminErr.message);
            // If using JSON fallback, try server's initializeAdmin
            if (!useSupabase) {
                try {
                    await initializeAdmin();
                } catch (e) {
                    console.warn('⚠️ Fallback admin initialization warning:', e.message);
                }
            }
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 BABISHA Admin Server running on http://localhost:${PORT}`);
            console.log(`\n📱 Access Points:`);
            console.log(`   • Main Website: http://localhost:${PORT}/index.html`);
            console.log(`   • Admin Panel: http://localhost:${PORT}/admin/login.html`);
            console.log(`   • API: http://localhost:${PORT}/api/admin`);
            if (useSupabase) {
                console.log(`\n📊 Using Supabase PostgreSQL database`);
                if (storage) {
                    console.log(`📸 Using Supabase Storage for images`);
                } else {
                    console.log(`📸 Using local file storage (uploads/ folder)`);
                }
            } else {
                console.log(`\n📁 Using JSON file storage (data/ folder)`);
                console.log(`📸 Using local file storage (uploads/ folder)`);
                console.log(`✅ Admin panel is fully functional with local storage`);
            }
            console.log(`\n🔐 Admin Login: admin@babisha.com / admin123`);
        });
    } catch (error) {
        console.error('❌ Server initialization error:', error);
        process.exit(1);
    }
}

startServer().catch(console.error);

