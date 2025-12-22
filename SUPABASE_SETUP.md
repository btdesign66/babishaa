# Supabase Integration Setup Guide

## 📋 Prerequisites

1. Supabase account with PostgreSQL database
2. Supabase Storage bucket created
3. Supabase API keys

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase JavaScript client
- `pg` - PostgreSQL client for Node.js

### 2. Configure Supabase Connection

Update `supabase-config.js` with your credentials:

```javascript
// Replace [YOUR-PASSWORD] with your actual Supabase database password
const connectionString = 'postgresql://postgres:[YOUR-PASSWORD]@db.xuyzhodfxmefruvsgvfh.supabase.co:5432/postgres';

// Get these from Supabase Dashboard > Settings > API
const SUPABASE_URL = 'https://xuyzhodfxmefruvsgvfh.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
const SUPABASE_SERVICE_KEY = 'your-service-key-here'; // Keep secret!
```

### 3. Create Database Schema

Run the SQL schema in your Supabase SQL Editor:

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste contents of `supabase-schema.sql`
4. Run the SQL script

This will create:
- `admin_users` table
- `products` table
- `product_images` table
- `blogs` table
- Indexes and triggers

### 4. Create Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `babisha-images`
3. Set it to **Public** (for public image access)
4. Configure CORS if needed

### 5. Update Environment Variables

Create a `.env` file (or update your environment):

```env
SUPABASE_DB_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xuyzhodfxmefruvsgvfh.supabase.co:5432/postgres
SUPABASE_URL=https://xuyzhodfxmefruvsgvfh.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
PORT=3001
JWT_SECRET=your-secret-key
```

### 6. Update Default Admin Password

After running the schema, update the admin password:

```sql
-- Hash password for 'admin123' using bcrypt
UPDATE admin_users 
SET password = '$2a$10$rOzJqXjZJZJZJZJZJZJZJ.uJZJZJZJZJZJZJZJZJZJZJZJZJZJZJZJ'
WHERE email = 'admin@babisha.com';
```

Or use Node.js to hash:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('admin123', 10);
console.log(hash);
```

## 🚀 Usage

After setup, restart your server:

```bash
node server.js
```

The server will now use Supabase PostgreSQL for data storage and Supabase Storage for images.

## 📁 File Structure

- `supabase-schema.sql` - Database schema
- `supabase-config.js` - Supabase configuration
- `database.js` - Database service layer
- `storage-service.js` - Image upload service
- `server.js` - Updated to use Supabase

## 🔍 Verification

1. Check database connection:
   ```bash
   node -e "require('./supabase-config').pool.query('SELECT NOW()').then(r => console.log('Connected:', r.rows[0]))"
   ```

2. Test image upload:
   - Try uploading an image in admin panel
   - Check Supabase Storage bucket

3. Verify data:
   - Create a product in admin panel
   - Check `products` table in Supabase Dashboard

## 🐛 Troubleshooting

### Connection Issues
- Verify database password is correct
- Check if Supabase project is active
- Ensure SSL is enabled

### Storage Issues
- Verify bucket name is `babisha-images`
- Check bucket is set to Public
- Verify service key has storage permissions

### Migration from JSON
- Existing JSON data needs to be migrated manually
- Use a migration script or import via admin panel

## 📝 Notes

- Images are stored in Supabase Storage, not local filesystem
- Database uses PostgreSQL with JSONB for flexible data
- All CRUD operations now use Supabase
- Backward compatible with existing admin panel UI

