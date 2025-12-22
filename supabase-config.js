/**
 * Supabase Configuration
 * Replace [YOUR-PASSWORD] with your actual Supabase password
 */

const { createClient } = require('@supabase/supabase-js');

// Parse connection string
const connectionString = process.env.SUPABASE_DB_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.xuyzhodfxmefruvsgvfh.supabase.co:5432/postgres';

// Extract Supabase project URL and anon key from connection string
// For Supabase, we need both the database connection and the Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xuyzhodfxmefruvsgvfh.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_AD8G79bYIJPhV2uO6tjPTw_TfHxlGA3';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'sb_publishable_AD8G79bYIJPhV2uO6tjPTw_TfHxlGA3'; // Note: For admin operations, use Service Role Key instead

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

