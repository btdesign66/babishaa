/**
 * Reset Database Schema
 * This script safely resets the database schema without deleting the entire database
 * It drops and recreates all tables, preserving the database connection
 */

const { pool } = require('./supabase-config');

async function resetSchema() {
    const client = await pool.connect();
    try {
        console.log('🔄 Resetting database schema...\n');
        
        await client.query('BEGIN');
        
        // Drop tables in reverse order (to handle foreign keys)
        console.log('📋 Dropping existing tables...');
        await client.query('DROP TABLE IF EXISTS product_images CASCADE');
        await client.query('DROP TABLE IF EXISTS products CASCADE');
        await client.query('DROP TABLE IF EXISTS blogs CASCADE');
        await client.query('DROP TABLE IF EXISTS admin_users CASCADE');
        
        console.log('✅ Tables dropped\n');
        
        // Recreate schema
        console.log('📋 Creating tables...');
        
        // Enable UUID extension
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        
        // Admin Users Table
        await client.query(`
            CREATE TABLE admin_users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'admin',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ admin_users table created');
        
        // Products Table
        await client.query(`
            CREATE TABLE products (
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
            )
        `);
        console.log('✅ products table created');
        
        // Product Images Table
        await client.query(`
            CREATE TABLE product_images (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                image_url TEXT NOT NULL,
                image_path TEXT NOT NULL,
                display_order INTEGER DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ product_images table created');
        
        // Blogs Table
        await client.query(`
            CREATE TABLE blogs (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                content TEXT NOT NULL,
                excerpt TEXT,
                featured_image_url TEXT,
                featured_image_path TEXT,
                meta_title VARCHAR(255),
                meta_description TEXT,
                status VARCHAR(20) DEFAULT 'draft',
                author VARCHAR(255) DEFAULT 'Admin',
                published_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ blogs table created');
        
        // Create indexes
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id)');
        console.log('✅ Indexes created');
        
        // Create update trigger function
        await client.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);
        
        // Add triggers
        await client.query(`
            DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
            CREATE TRIGGER update_admin_users_updated_at 
                BEFORE UPDATE ON admin_users 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        
        await client.query(`
            DROP TRIGGER IF EXISTS update_products_updated_at ON products;
            CREATE TRIGGER update_products_updated_at 
                BEFORE UPDATE ON products 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        
        await client.query(`
            DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
            CREATE TRIGGER update_blogs_updated_at 
                BEFORE UPDATE ON blogs 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('✅ Triggers created');
        
        // Insert default admin user
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await client.query(`
            INSERT INTO admin_users (email, password, name, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, ['admin@babisha.com', hashedPassword, 'Admin User', 'admin']);
        console.log('✅ Default admin user created (admin@babisha.com / admin123)');
        
        await client.query('COMMIT');
        
        console.log('\n🎉 Database schema reset successfully!');
        console.log('\n📝 Next steps:');
        console.log('1. Restart your server: node server.js');
        console.log('2. Test adding a product or blog');
        console.log('3. Login with: admin@babisha.com / admin123');
        
        process.exit(0);
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('\n❌ Error resetting schema:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    } finally {
        client.release();
    }
}

// Run the reset
resetSchema();

