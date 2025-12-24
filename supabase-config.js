/**
 * Supabase Configuration
 * 
 * INSTRUCTIONS:
 * 1. Get your Supabase project URL from: Dashboard > Settings > API > Project URL
 * 2. Get your Service Role Key from: Dashboard > Settings > API > Service Role Key (secret)
 * 3. Get your Database Connection String from: Dashboard > Settings > Database > Connection String
 *    - Use "Session Pooler" mode (port 6543) for server applications
 * 4. Replace the values below with your actual credentials
 */

const { createClient } = require('@supabase/supabase-js');

// ==================== SUPABASE PROJECT CREDENTIALS ====================
// Replace these with your actual Supabase project credentials

// Your Supabase project URL
// Set via environment variable: SUPABASE_URL
const SUPABASE_URL = process.env.SUPABASE_URL;
if (!SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required');
}

// Service Role Key (secret key that bypasses Row Level Security)
// Set via environment variable: SUPABASE_SERVICE_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
if (!SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_KEY environment variable is required');
}

// Database connection string (Session Pooler mode)
// Set via environment variable: SUPABASE_DB_URL
// Format: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-[REGION].pooler.supabase.com:5432/postgres
// URL-encode special characters in password (@ becomes %40)
const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
    throw new Error('SUPABASE_DB_URL environment variable is required');
}

// ==================== CREATE SUPABASE CLIENT ====================
// This client is used for Storage and API operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ==================== POSTGRESQL CONNECTION ====================
// This is used for direct database queries
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

// ==================== EXPORTS ====================
module.exports = {
    supabase,           // Supabase client for Storage/API
    pool,               // PostgreSQL pool for direct queries
    SUPABASE_URL,       // Project URL
    SUPABASE_SERVICE_KEY // Service Role Key
};
