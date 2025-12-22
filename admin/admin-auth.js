/**
 * Admin Authentication JavaScript
 */

const API_BASE_URL = 'http://localhost:3001/api/admin';

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Verify token
        verifyToken(token);
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('adminPassword');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Handle login form submission
document.getElementById('adminLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const loginBtn = document.getElementById('loginBtn');
    const errorAlert = document.getElementById('errorAlert');
    
    // Show loading state
    loginBtn.innerHTML = '<span class="loading-spinner"></span> Signing in...';
    loginBtn.disabled = true;
    errorAlert.classList.add('d-none');
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Store token and user info
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Show error
            errorAlert.textContent = data.error || 'Login failed. Please try again.';
            errorAlert.classList.remove('d-none');
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Sign In';
            loginBtn.disabled = false;
        }
    } catch (error) {
        console.error('Login error:', error);
        errorAlert.textContent = 'Connection error. Please check if the server is running.';
        errorAlert.classList.remove('d-none');
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Sign In';
        loginBtn.disabled = false;
    }
});

// Verify token
async function verifyToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Token is valid, redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Token is invalid, clear storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
        }
    } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Get auth token for API requests
function getAuthToken() {
    return localStorage.getItem('adminToken');
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Check authentication and redirect if not logged in
function requireAuth() {
    const token = getAuthToken();
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.getElementById('adminSidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

