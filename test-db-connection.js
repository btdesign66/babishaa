/**
 * Test Database Connection
 * Run this to check if database is working
 */

async function testConnection() {
    console.log('🔍 Testing database connection...\n');
    
    try {
        const db = require('./database');
        console.log('✅ Database module loaded');
        
        // Test connection
        const result = await db.pool.query('SELECT NOW()');
        console.log('✅ Database connection successful');
        console.log('   Current time:', result.rows[0].now);
        
        // Test products table
        try {
            const products = await db.getAllProducts();
            console.log(`✅ Products table accessible (${products.length} products)`);
        } catch (err) {
            console.error('❌ Error accessing products:', err.message);
        }
        
        // Test blogs table
        try {
            const blogs = await db.getAllBlogs();
            console.log(`✅ Blogs table accessible (${blogs.length} blogs)`);
        } catch (err) {
            console.error('❌ Error accessing blogs:', err.message);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.log('\n⚠️  Falling back to JSON file storage...');
        
        try {
            const dbFallback = require('./database-fallback');
            console.log('✅ Fallback database module loaded');
            
            const products = await dbFallback.getAllProducts();
            console.log(`✅ JSON products file accessible (${products.length} products)`);
            
            const blogs = await dbFallback.getAllBlogs();
            console.log(`✅ JSON blogs file accessible (${blogs.length} blogs)`);
        } catch (fallbackErr) {
            console.error('❌ Fallback also failed:', fallbackErr.message);
        }
        
        process.exit(1);
    }
}

testConnection();

