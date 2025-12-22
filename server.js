/**
 * BABISHA Admin Panel - Backend Server
 * Express.js server with authentication and CRUD APIs
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

// Supabase imports
const db = require('./database');
const storage = require('./storage-service');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'babisha-admin-secret-key-change-in-production';

// Middleware
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve admin panel static files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

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
const storage = multer.diskStorage({
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
    storage: storage,
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
        // Upload images to Supabase Storage
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadResults = await storage.uploadImages(req.files, 'products');
            imageUrls = uploadResults.map(result => result.url);
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
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            price: parseFloat(req.body.price) || 0,
            originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
            discountPrice: req.body.discountPrice ? parseFloat(req.body.discountPrice) : null,
            images: imageUrls,
            stock: parseInt(req.body.stock) || 0,
            isActive: req.body.isActive === 'true' || req.body.isActive === true,
            specifications: specifications,
            supplier: req.body.supplier || 'BABISHA Collections',
            rating: parseFloat(req.body.rating) || 0,
            reviews: parseInt(req.body.reviews) || 0,
            onSale: req.body.onSale === 'true' || req.body.onSale === true,
            savings: req.body.savings ? parseFloat(req.body.savings) : null
        };

        const newProduct = await db.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Create product error:', error);
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
            const uploadResults = await storage.uploadImages(req.files, 'products');
            const newImageUrls = uploadResults.map(result => result.url);
            imageUrls = [...imageUrls, ...newImageUrls];
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
        
        // Delete images from Supabase Storage
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                const imagePath = storage.extractPathFromUrl(imageUrl);
                if (imagePath) {
                    await storage.deleteImage(imagePath);
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
        const products = await readJSONFile('products.json');
        const product = products.find(p => p.id === req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageIndex = parseInt(req.params.imageIndex);
        if (product.images && product.images[imageIndex]) {
            // Optionally delete file from filesystem
            const imagePath = path.join(__dirname, product.images[imageIndex]);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                console.error('Error deleting image file:', err);
            }
            
            product.images.splice(imageIndex, 1);
            product.updatedAt = new Date().toISOString();
            
            await writeJSONFile('products.json', products);
            res.json({ message: 'Image deleted successfully', product });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: 'Internal server error' });
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
        let featuredImageUrl = null;
        let featuredImagePath = null;
        
        // Upload featured image to Supabase Storage if provided
        if (req.file) {
            const uploadResult = await storage.uploadImage(req.file, 'blogs');
            featuredImageUrl = uploadResult.url;
            featuredImagePath = uploadResult.path;
        }
        
        const blogData = {
            title: req.body.title,
            slug: req.body.slug || req.body.title.toLowerCase().replace(/\s+/g, '-'),
            content: req.body.content,
            excerpt: req.body.excerpt || req.body.content.substring(0, 200),
            featuredImageUrl: featuredImageUrl,
            featuredImagePath: featuredImagePath,
            metaTitle: req.body.metaTitle || req.body.title,
            metaDescription: req.body.metaDescription || req.body.excerpt || req.body.content.substring(0, 160),
            status: req.body.status || 'draft',
            author: req.user.name || 'Admin'
        };

        const newBlog = await db.createBlog(blogData);
        res.status(201).json(newBlog);
    } catch (error) {
        console.error('Create blog error:', error);
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
            // Delete old image from Supabase Storage
            if (existingBlog.featured_image_path) {
                await storage.deleteImage(existingBlog.featured_image_path);
            }
            
            // Upload new image
            const uploadResult = await storage.uploadImage(req.file, 'blogs');
            featuredImageUrl = uploadResult.url;
            featuredImagePath = uploadResult.path;
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
        
        // Delete featured image from Supabase Storage
        if (blog.featured_image_path) {
            await storage.deleteImage(blog.featured_image_path);
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
        // Test database connection
        const testResult = await db.pool.query('SELECT NOW()');
        console.log('✅ Database connected:', testResult.rows[0].now);
        
        // Test Supabase Storage connection
        const { data: buckets } = await db.supabase.storage.listBuckets();
        console.log('✅ Supabase Storage connected');
        
        await ensureDirectories();
        
        app.listen(PORT, () => {
            console.log(`🚀 BABISHA Admin Server running on http://localhost:${PORT}`);
            console.log(`📊 Using Supabase PostgreSQL database`);
            console.log(`📸 Using Supabase Storage for images`);
        });
    } catch (error) {
        console.error('❌ Server initialization error:', error);
        console.error('Please check your Supabase configuration in supabase-config.js');
        process.exit(1);
    }
}

startServer().catch(console.error);

