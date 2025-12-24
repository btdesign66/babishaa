# 🔧 Fix Connection String Issue

## The Problem
The error `getaddrinfo ENOTFOUND db.xuyzhodfxmefruvsgvfh.supabase.co` means the hostname can't be found.

## ✅ Solution: Get the Correct Connection String

The connection string format might be different. Follow these steps:

### Step 1: Get Connection String from Supabase Dashboard

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Scroll to **Connection String** section
4. You'll see different connection modes:
   - **URI** (Direct connection)
   - **Connection Pooling** (Recommended for server apps)

### Step 2: Use Connection Pooling (Recommended)

For server applications, use the **Connection Pooling** connection string. It looks like:
```
postgresql://postgres.xuyzhodfxmefruvsgvfh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Or it might be:
```
postgresql://postgres.xuyzhodfxmefruvsgvfh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Step 3: Update supabase-config.js

Replace the connection string with the one from your dashboard. Make sure to:
- Use the **Connection Pooling** connection string (port 6543 or 5432)
- Replace `[YOUR-PASSWORD]` with your actual password: `babisha@123BT`
- URL-encode the `@` symbol as `%40` in the password

Example:
```javascript
const connectionString = process.env.SUPABASE_DB_URL || 'postgresql://postgres.xuyzhodfxmefruvsgvfh:babisha%40123BT@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
```

### Step 4: Alternative - Use Direct Connection

If connection pooling doesn't work, try the **Direct connection** (URI):
```
postgresql://postgres:[YOUR-PASSWORD]@db.xuyzhodfxmefruvsgvfh.supabase.co:5432/postgres
```

But make sure the hostname format matches what Supabase shows in your dashboard.

## 🔍 Check Your Supabase Dashboard

The exact connection string format depends on:
- Your Supabase region
- Whether you're using connection pooling
- Your project's specific configuration

**Copy the exact connection string from your Supabase Dashboard** and replace only the password part.

