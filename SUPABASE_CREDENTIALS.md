# 🔐 Supabase Credentials Configuration

## Current Configuration

**Project URL:** `https://xuyzhodfxmefruvsgvfh.supabase.co`  
**Publishable API Key:** `sb_publishable_AD8G79bYIJPhV2uO6tjPTw_TfHxlGA3`

## ⚠️ Important Notes

### Service Role Key Required

For **admin operations** (creating/updating/deleting products and blogs), you need the **Service Role Key**, not the Publishable Key.

The Publishable Key has limited permissions and is meant for client-side operations. The Service Role Key has full admin access.

### How to Get Service Role Key

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Find **Service Role Key** (keep this secret!)
5. Copy the key

### Update Configuration

Update `supabase-config.js` with your Service Role Key:

```javascript
const SUPABASE_SERVICE_KEY = 'your-service-role-key-here';
```

## Database Connection

Your database connection string format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xuyzhodfxmefruvsgvfh.supabase.co:5432/postgres
```

Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

## Current Setup Status

✅ Project URL configured  
✅ Publishable Key configured  
⚠️ Service Role Key needed for full admin functionality  
⚠️ Database password needed in connection string

## Next Steps

1. **Get Service Role Key** from Supabase Dashboard
2. **Update `supabase-config.js`** with Service Role Key
3. **Update connection string** with your database password
4. **Run database schema** (`supabase-schema.sql`) in Supabase SQL Editor
5. **Create storage bucket** named `babisha-images` (set to Public)
6. **Restart server**: `node server.js`

## Testing

After configuration, test the connection:

```bash
node server.js
```

You should see:
- ✅ Database connected
- ✅ Supabase Storage connected

If you see errors, check:
- Database password is correct
- Service Role Key is correct
- Database schema has been run
- Storage bucket exists

