-- BABISHA Database Schema for Supabase PostgreSQL
-- Run this SQL in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== ADMIN USERS TABLE ====================
-- Stores admin login credentials
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PRODUCTS TABLE ====================
-- Stores product information
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    original_price DECIMAL(10, 2),
    discount_price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    specifications JSONB DEFAULT '{}',
    supplier VARCHAR(255) DEFAULT 'BABISHA Collections',
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    on_sale BOOLEAN DEFAULT false,
    savings DECIMAL(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==================== PRODUCT IMAGES TABLE ====================
-- Stores multiple images per product
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==================== BLOGS TABLE ====================
-- Stores blog posts
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image_url TEXT,
    featured_image_path TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    author VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- ==================== INDEXES ====================
-- Improve query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(on_sale);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- ==================== TRIGGERS ====================
-- Auto-update updated_at timestamp

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at 
    BEFORE UPDATE ON admin_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for blogs
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON blogs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== DEFAULT ADMIN USER ====================
-- Insert default admin user (password: admin123)
-- Password is hashed using bcrypt
INSERT INTO admin_users (email, password, name, role)
VALUES (
    'admin@babisha.com',
    '$2a$10$WbCNVqFViLzlycQ.1VF/7ONFdBuzsndPLXancjhYGrMgvHOGi2Vxq',
    'Admin User',
    'admin'
)
ON CONFLICT (email) DO NOTHING;

-- ==================== NOTES ====================
-- 1. Default admin login: admin@babisha.com / admin123
-- 2. Images will be stored in Supabase Storage buckets: 'products' and 'blogs'
-- 3. All timestamps are in UTC with timezone
-- 4. Product images are linked via foreign key with CASCADE delete

