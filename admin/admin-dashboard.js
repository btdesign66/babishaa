/**
 * Admin Dashboard JavaScript
 */

const API_BASE_URL = 'http://localhost:3001/api/admin';

// Check authentication on page load
if (!requireAuth()) {
    // Redirect will happen in admin-auth.js
}

// Load dashboard stats
async function loadDashboardStats() {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            
            document.getElementById('totalDresses').textContent = stats.totalDresses || 0;
            document.getElementById('totalBlogs').textContent = stats.totalBlogs || 0;
            document.getElementById('activeProducts').textContent = stats.activeProducts || 0;
            document.getElementById('revenue').textContent = `₹${parseFloat(stats.revenue || 0).toLocaleString('en-IN')}`;
        } else {
            console.error('Failed to load dashboard stats');
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load user info
function loadUserInfo() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('adminUserName').textContent = user.name || user.email;
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('adminSidebar');
    sidebar.classList.toggle('mobile-open');
}

// Initialize dashboard
window.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadDashboardStats();
    
    // Refresh stats every 30 seconds
    setInterval(loadDashboardStats, 30000);
});

