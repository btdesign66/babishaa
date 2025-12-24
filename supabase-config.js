/**
 * Supabase Configuration
 * Replace [YOUR-PASSWORD] with your actual Supabase password
 */

const { createClient } = require('@supabase/supabase-js');

// Parse connection string
// Password: babisha@123BT (the @ symbol is URL-encoded as %40)
// IMPORTANT: Use Session Pooler for IPv4 compatibility (not Direct connection)
// Get the exact connection string from: Supabase Dashboard > Settings > Database > Connection String
// Switch to "Session Pooler" mode and copy the connection string
// Replace the hostname below with the one from your dashboard (usually aws-0-us-east-1.pooler.supabase.com or similar)
const connectionString = process.env.SUPABASE_DB_URL || 'postgresql://postgres.xuyzhodfxmefruvsgvfh:babisha%40123BT@aws-0-us-east-1.pooler.supabase.com:6543/postgres';

// Extract Supabase project URL and anon key from connection string
// For Supabase, we need both the database connection and the Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xuyzhodfxmefruvsgvfh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_AD8G79bYIJPhV2uO6tjPTw_TfHxlGA3';
// IMPORTANT: For admin operations, you need the Service Role Key (not publishable key)
// Get it from Supabase Dashboard > Settings > API > Service Role Key
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_AD8G79bYIJPhV2uO6tjPTw_TfHxlGA3';

// Create Supabase client for Storage and API
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// PostgreSQL connection using pg library
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {
    supabase,
    pool,
    SUPABASE_URL,
    SUPABASE_ANON_KEY
};

