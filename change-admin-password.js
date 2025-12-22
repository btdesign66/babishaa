/**
 * Script to change admin password
 * Usage: node change-admin-password.js <email> <new-password>
 */

const bcrypt = require('bcryptjs');
const { pool } = require('./supabase-config');

async function changePassword(email, newPassword) {
    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update in database
        const client = await pool.connect();
        try {
            const result = await client.query(
                'UPDATE admin_users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2 RETURNING email, name',
                [hashedPassword, email]
            );
            
            if (result.rows.length === 0) {
                console.error(`❌ User with email ${email} not found!`);
                process.exit(1);
            }
            
            console.log(`✅ Password updated successfully for ${result.rows[0].name} (${result.rows[0].email})`);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('❌ Error changing password:', error);
        process.exit(1);
    }
}

// Get command line arguments
const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
    console.log('Usage: node change-admin-password.js <email> <new-password>');
    console.log('Example: node change-admin-password.js admin@babisha.com MyNewPassword123');
    process.exit(1);
}

changePassword(email, newPassword).then(() => {
    process.exit(0);
});

