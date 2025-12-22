/**
 * Admin Dashboard JavaScript
 */

const API_BASE_URL = 'http://localhost:3001/api/admin';

// Check authentication on page load
let isDashboardInitialized = false;

if (typeof requireAuth === 'function' && !requireAuth()) {
    // Redirect will happen in admin-auth.js
}

// Load dashboard stats
let isLoadingStats = false;

async function loadDashboardStats() {
    if (isLoadingStats) return;
    isLoadingStats = true;
    
    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            
            const totalDressesEl = document.getElementById('totalDresses');
            const totalBlogsEl = document.getElementById('totalBlogs');
            const activeProductsEl = document.getElementById('activeProducts');
            const revenueEl = document.getElementById('revenue');
            
            if (totalDressesEl) totalDressesEl.textContent = stats.totalDresses || 0;
            if (totalBlogsEl) totalBlogsEl.textContent = stats.totalBlogs || 0;
            if (activeProductsEl) activeProductsEl.textContent = stats.activeProducts || 0;
            if (revenueEl) revenueEl.textContent = `₹${parseFloat(stats.revenue || 0).toLocaleString('en-IN')}`;
        } else {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            console.error('Failed to load dashboard stats:', response.status);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    } finally {
        isLoadingStats = false;
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
    if (isDashboardInitialized) return;
    isDashboardInitialized = true;
    
    if (typeof requireAuth === 'function' && !requireAuth()) {
        return;
    }
    
    loadUserInfo();
    loadDashboardStats();
    
    // Refresh stats every 30 seconds (only if page is visible)
    setInterval(() => {
        if (!document.hidden) {
            loadDashboardStats();
        }
    }, 30000);
});

