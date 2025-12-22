# 🔐 Admin Panel Credentials

## Default Login Credentials

**Email:** `admin@babisha.com`  
**Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

## How to Change Admin Password

### Option 1: Using the Password Change Script

```bash
node change-admin-password.js admin@babisha.com YourNewPassword123
```

### Option 2: Using SQL Directly

1. Generate password hash:
```bash
node -e "const bcrypt=require('bcryptjs');bcrypt.hash('YourNewPassword',10).then(h=>console.log(h))"
```

2. Update in Supabase SQL Editor:
```sql
UPDATE admin_users 
SET password = 'YOUR_GENERATED_HASH_HERE',
    updated_at = CURRENT_TIMESTAMP
WHERE email = 'admin@babisha.com';
```

### Option 3: Using Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor → `admin_users`
2. Find the admin user
3. Edit the password field (you'll need to hash it first using Option 2)

## Security Best Practices

1. ✅ **Change default password immediately**
2. ✅ **Use a strong password** (min 12 characters, mix of letters, numbers, symbols)
3. ✅ **Don't share admin credentials**
4. ✅ **Use environment variables** for production
5. ✅ **Enable 2FA** if available in Supabase

## Creating Additional Admin Users

### Using SQL:

```sql
INSERT INTO admin_users (email, password, name, role)
VALUES (
    'newadmin@babisha.com',
    '$2a$10$YOUR_HASHED_PASSWORD_HERE',
    'New Admin Name',
    'admin'
);
```

### Using the Script:

First create the user manually in database, then change password:
```bash
node change-admin-password.js newadmin@babisha.com NewPassword123
```

## Password Hash Generator

To generate a password hash for any password:

```bash
node -e "const bcrypt=require('bcryptjs');bcrypt.hash('YourPassword',10).then(h=>console.log('Hash:',h))"
```

## Troubleshooting

### Can't Login?
1. Verify email is correct: `admin@babisha.com`
2. Verify password is correct: `admin123`
3. Check if user exists in database
4. Check server logs for errors

### Password Not Working?
1. Verify password hash in database matches
2. Try resetting password using the script
3. Check if bcrypt is working correctly

---

**Remember:** Keep your admin credentials secure and never commit them to version control!

