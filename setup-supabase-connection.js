/**
 * Setup Supabase Connection
 * This script helps configure Supabase connection
 */

const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupConnection() {
    console.log('🔧 Supabase Connection Setup\n');
    console.log('Current configuration:');
    console.log('  Project URL: https://xuyzhodfxmefruvsgvfh.supabase.co');
    console.log('  API Key: sb_publishable_AD8G79bYIJPhV2uO6tjPTw_TfHxlGA3\n');
    
    console.log('⚠️  IMPORTANT: You need your DATABASE PASSWORD to connect.');
    console.log('   Get it from: Supabase Dashboard > Settings > Database > Connection String\n');
    
    const dbPassword = await question('Enter your Supabase Database Password: ');
    
    if (!dbPassword || dbPassword.trim() === '') {
        console.log('❌ Password is required. Exiting...');
        rl.close();
        process.exit(1);
    }
    
    // Read current config
    const configPath = path.join(__dirname, 'supabase-config.js');
    let configContent = await fs.readFile(configPath, 'utf8');
    
    // Update connection string
    const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword.trim())}@db.xuyzhodfxmefruvsgvfh.supabase.co:5432/postgres`;
    configContent = configContent.replace(
        /const connectionString = .*?;/,
        `const connectionString = process.env.SUPABASE_DB_URL || '${connectionString}';`
    );
    
    // Write updated config
    await fs.writeFile(configPath, configContent, 'utf8');
    
    console.log('\n✅ Configuration updated!');
    console.log('\n📝 Next steps:');
    console.log('1. Get your Service Role Key from Supabase Dashboard > Settings > API');
    console.log('2. Update SUPABASE_SERVICE_KEY in supabase-config.js');
    console.log('3. Restart the server: node server.js');
    console.log('\n🧪 Testing connection...\n');
    
    rl.close();
    
    // Test connection
    try {
        const db = require('./database');
        const result = await db.pool.query('SELECT NOW()');
        console.log('✅ Database connection successful!');
        console.log('   Current time:', result.rows[0].now);
        
        // Test tables
        try {
            const products = await db.getAllProducts();
            console.log(`✅ Products table accessible (${products.length} products)`);
        } catch (err) {
            console.error('❌ Error accessing products:', err.message);
        }
        
        try {
            const blogs = await db.getAllBlogs();
            console.log(`✅ Blogs table accessible (${blogs.length} blogs)`);
        } catch (err) {
            console.error('❌ Error accessing blogs:', err.message);
        }
        
        console.log('\n🎉 Setup complete! You can now restart the server.');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Connection test failed:', error.message);
        console.error('\nPlease check:');
        console.error('1. Database password is correct');
        console.error('2. Database is accessible from your network');
        console.error('3. Tables are created (run supabase-schema.sql)');
        process.exit(1);
    }
}

setupConnection();

