/**
 * Admin Products Management JavaScript
 */

const API_BASE_URL = 'http://localhost:3001/api/admin';
let products = [];
let editingProductId = null;
let imageFiles = [];
let existingImages = [];

// Check authentication
let isInitialized = false;

if (typeof requireAuth === 'function' && !requireAuth()) {
    // Redirect will happen in admin-auth.js
}

// Load products
let isLoadingProducts = false;

async function loadProducts() {
    if (isLoadingProducts) return;
    isLoadingProducts = true;
    
    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            products = await response.json() || [];
            renderProducts();
        } else {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return;
            }
            console.error('Failed to load products:', response.status);
            showAlert('Failed to load products', 'error');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products: ' + error.message, 'error');
    } finally {
        isLoadingProducts = false;
    }
}

// Render products table
function renderProducts(filteredProducts = null) {
    const tbody = document.getElementById('productsTableBody');
    const productsToRender = filteredProducts || products;

    if (productsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <p class="text-muted">No products found. Click "Add New Product" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = productsToRender.map(product => {
        // Fix image path
        let imageUrl = '../images/placeholder.jpg';
        if (product.images && product.images[0]) {
            imageUrl = product.images[0].startsWith('http') ? product.images[0] : 
                      product.images[0].startsWith('/') ? product.images[0] : 
                      `/${product.images[0]}`;
        }
        
        return `
        <tr>
            <td>
                <img src="${imageUrl}" 
                     alt="${product.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;"
                     onerror="this.src='../images/placeholder.jpg'">
            </td>
            <td>
                <strong>${product.name || 'Unnamed Product'}</strong>
                <br>
                <small class="text-muted">${product.description ? (product.description.length > 50 ? product.description.substring(0, 50) + '...' : product.description) : 'No description'}</small>
            </td>
            <td><span class="badge bg-secondary">${product.category || 'N/A'}</span></td>
            <td>
                <strong>₹${parseFloat(product.price || 0).toLocaleString('en-IN')}</strong>
                ${product.originalPrice ? `<br><small class="text-muted"><s>₹${parseFloat(product.originalPrice).toLocaleString('en-IN')}</s></small>` : ''}
            </td>
            <td>${product.stock || 0}</td>
            <td>
                <span class="status-badge ${product.isActive !== false ? 'status-badge-active' : 'status-badge-inactive'}">
                    ${product.isActive !== false ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="admin-btn admin-btn-warning btn-sm" onclick="editProduct('${product.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="admin-btn admin-btn-danger btn-sm" onclick="deleteProduct('${product.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
    }).join('');
}

// Show product form
function showProductForm(productId = null) {
    editingProductId = productId;
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const form = document.getElementById('productForm');
    
    if (productId) {
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        loadProductData(productId);
    } else {
        document.getElementById('productModalTitle').textContent = 'Add New Product';
        form.reset();
        imageFiles = [];
        existingImages = [];
        document.getElementById('imagePreviewGrid').innerHTML = '';
    }
    
    modal.show();
}

// Load product data for editing
async function loadProductData(productId) {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const product = await response.json();
            
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name || '';
            document.getElementById('productCategory').value = product.category || '';
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productOriginalPrice').value = product.originalPrice || '';
            document.getElementById('productDiscountPrice').value = product.discountPrice || '';
            document.getElementById('productStock').value = product.stock || '';
            document.getElementById('productStatus').value = product.isActive !== false ? 'true' : 'false';
            document.getElementById('productRating').value = product.rating || '';
            document.getElementById('productReviews').value = product.reviews || '';
            document.getElementById('productOnSale').value = product.onSale ? 'true' : 'false';
            document.getElementById('productSpecifications').value = JSON.stringify(product.specifications || {}, null, 2);
            
            // Load existing images
            existingImages = product.images || [];
            renderImagePreviews();
        }
    } catch (error) {
        console.error('Error loading product:', error);
        showAlert('Error loading product data', 'error');
    }
}

// Handle image preview
function handleImagePreview(event) {
    const files = Array.from(event.target.files);
    imageFiles = [...imageFiles, ...files];
    renderImagePreviews();
}

// Render image previews
async function renderImagePreviews() {
    const previewGrid = document.getElementById('imagePreviewGrid');
    let html = '';

    // Existing images
    existingImages.forEach((imageUrl, index) => {
        // Fix image path if needed
        const imagePath = imageUrl.startsWith('http') ? imageUrl : 
                         imageUrl.startsWith('/') ? imageUrl : 
                         `/${imageUrl}`;
        html += `
            <div class="image-preview-item">
                <img src="${imagePath}" alt="Preview ${index + 1}" onerror="this.src='../images/placeholder.jpg'">
                <button type="button" class="remove-image" onclick="removeExistingImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });

    // New images
    const newImagePromises = imageFiles.map((file, index) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                html += `
                    <div class="image-preview-item">
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <button type="button" class="remove-image" onclick="removeNewImage(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                resolve();
            };
            reader.readAsDataURL(file);
        });
    });

    await Promise.all(newImagePromises);
    previewGrid.innerHTML = html;

    if (imageFiles.length === 0 && existingImages.length === 0) {
        previewGrid.innerHTML = '';
    }
}

// Remove existing image
function removeExistingImage(index) {
    existingImages.splice(index, 1);
    renderImagePreviews();
}

// Remove new image
function removeNewImage(index) {
    imageFiles.splice(index, 1);
    renderImagePreviews();
}

// Handle product form submission
const productForm = document.getElementById('productForm');
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    const productId = document.getElementById('productId').value;
    
    // Add form fields
    formData.append('name', document.getElementById('productName').value);
    formData.append('category', document.getElementById('productCategory').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('originalPrice', document.getElementById('productOriginalPrice').value);
    formData.append('discountPrice', document.getElementById('productDiscountPrice').value);
    formData.append('stock', document.getElementById('productStock').value);
    formData.append('isActive', document.getElementById('productStatus').value);
    formData.append('rating', document.getElementById('productRating').value);
    formData.append('reviews', document.getElementById('productReviews').value);
    formData.append('onSale', document.getElementById('productOnSale').value);
    formData.append('specifications', document.getElementById('productSpecifications').value);
    
    // Add new images
    imageFiles.forEach(file => {
        formData.append('images', file);
    });

    try {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : localStorage.getItem('adminToken');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const url = productId 
            ? `${API_BASE_URL}/products/${productId}`
            : `${API_BASE_URL}/products`;
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            showAlert(productId ? 'Product updated successfully!' : 'Product created successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            loadProducts();
            document.getElementById('productForm').reset();
            imageFiles = [];
            existingImages = [];
            document.getElementById('imagePreviewGrid').innerHTML = '';
        } else {
            let errorMessage = 'Failed to save product';
            try {
                const error = await response.json();
                errorMessage = error.error || errorMessage;
            } catch (e) {
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            showAlert(errorMessage, 'error');
            console.error('Product save error:', errorMessage);
        }
    } catch (error) {
        console.error('Error saving product:', error);
        showAlert('Error saving product: ' + error.message, 'error');
    }
    });
}

// Edit product
function editProduct(productId) {
    showProductForm(productId);
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showAlert('Product deleted successfully!', 'success');
            loadProducts();
        } else {
            showAlert('Failed to delete product', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showAlert('Error deleting product', 'error');
    }
}

// Show alert
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alertClass = type === 'success' ? 'admin-alert-success' : 
                      type === 'error' ? 'admin-alert-error' : 'admin-alert-info';
    
    const alert = document.createElement('div');
    alert.className = `admin-alert ${alertClass}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Search products
document.getElementById('productSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm) ||
        (p.description && p.description.toLowerCase().includes(searchTerm))
    );
    renderProducts(filtered);
});

// Drag and drop for images
const imageUploadArea = document.getElementById('imageUploadArea');
if (imageUploadArea) {
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragover');
    });

    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('dragover');
    });

    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        imageFiles = [...imageFiles, ...files];
        renderImagePreviews();
    });
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    if (isInitialized) return;
    isInitialized = true;
    
    // Wait for auth functions to be available
    if (typeof requireAuth === 'function' && !requireAuth()) {
        return;
    }
    
    loadProducts();
    
    // Check if URL has action=add parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add') {
        setTimeout(() => showProductForm(), 100);
    }
});

