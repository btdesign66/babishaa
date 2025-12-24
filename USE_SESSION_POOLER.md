# 🔧 Fix: Use Session Pooler for IPv4 Compatibility

## The Problem
Your Supabase dashboard shows: **"Not IPv4 compatible"** for the Direct connection. This is why the connection is failing.

## ✅ Solution: Use Session Pooler

### Step 1: Get Session Pooler Connection String

1. In your Supabase Dashboard, go to **Settings** → **Database** → **Connection String**
2. Click on **"Pooler settings"** button (or change the **Method** dropdown)
3. Select **"Session Pooler"** (or **"Connection Pooling"**)
4. Copy the connection string shown

It should look something like:
```
postgresql://postgres.xuyzhodfxmefruvsgvfh:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Note:** The hostname will be different (like `aws-0-us-east-1.pooler.supabase.com` or similar) and port will be **6543** (not 5432).

### Step 2: Update supabase-config.js

Replace the connection string with the Session Pooler connection string, but keep your password (`babisha%40123BT`):

```javascript
const connectionString = process.env.SUPABASE_DB_URL || 'postgresql://postgres.xuyzhodfxmefruvsgvfh:babisha%40123BT@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
```

**Important:** 
- Replace `aws-0-us-east-1.pooler.supabase.com` with the actual hostname from your dashboard
- Keep the password as `babisha%40123BT` (with `@` encoded as `%40`)
- Port should be **6543** for Session Pooler

### Step 3: Test Connection

```bash
node test-db-connection.js
```

You should see:
```
✅ Database connection successful
```

### Step 4: Restart Server

```bash
node server.js
```

You should see:
```
✅ Using Supabase PostgreSQL database
```

## Why Session Pooler?

- ✅ IPv4 compatible (works on IPv4 networks)
- ✅ Better for server applications
- ✅ Handles connection pooling automatically
- ✅ Recommended for production use

## Alternative: IPv4 Add-on

If you prefer to use Direct connection, you can purchase the IPv4 add-on from Supabase, but Session Pooler is the recommended and free solution.

