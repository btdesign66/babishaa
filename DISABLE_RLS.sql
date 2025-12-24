-- Disable Row Level Security (RLS) for Admin Operations
-- Run this in Supabase SQL Editor if using Publishable Key instead of Service Role Key
-- This allows the Publishable Key to perform admin operations

-- Disable RLS on all tables
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- Note: This makes tables accessible without RLS policies
-- Only do this if you're using Publishable Key and can't get Service Role Key
-- For production, it's better to use Service Role Key and keep RLS enabled

