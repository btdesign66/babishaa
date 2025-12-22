/**
 * Admin Blogs Management JavaScript
 */

const API_BASE_URL = 'http://localhost:3001/api/admin';
let blogs = [];
let editingBlogId = null;
let blogImageFile = null;
let existingBlogImage = null;
let quillEditor = null;

// Initialize Quill Editor
function initQuillEditor() {
    quillEditor = new Quill('#blogContentEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
}

// Check authentication
if (!requireAuth()) {
    // Redirect will happen in admin-auth.js
}

// Load blogs
async function loadBlogs() {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/blogs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            blogs = await response.json();
            renderBlogs();
        } else {
            showAlert('Failed to load blogs', 'error');
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        showAlert('Error loading blogs', 'error');
    }
}

// Render blogs table
function renderBlogs(filteredBlogs = null) {
    const tbody = document.getElementById('blogsTableBody');
    const blogsToRender = filteredBlogs || blogs;

    if (blogsToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <p class="text-muted">No blogs found. Click "Create New Blog" to create one.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = blogsToRender.map(blog => `
        <tr>
            <td>
                ${blog.featuredImage ? 
                    `<img src="${blog.featuredImage}" alt="${blog.title}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">` :
                    '<div style="width: 80px; height: 60px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image text-muted"></i></div>'
                }
            </td>
            <td>
                <strong>${blog.title}</strong>
                <br>
                <small class="text-muted">Slug: ${blog.slug || 'N/A'}</small>
            </td>
            <td>
                <p class="mb-0">${blog.excerpt ? (blog.excerpt.length > 100 ? blog.excerpt.substring(0, 100) + '...' : blog.excerpt) : 'No excerpt'}</p>
            </td>
            <td>
                <span class="status-badge ${blog.status === 'published' ? 'status-badge-published' : 'status-badge-draft'}">
                    ${blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
            </td>
            <td>
                <small>${new Date(blog.createdAt).toLocaleDateString()}</small>
                ${blog.publishedAt ? `<br><small class="text-muted">Published: ${new Date(blog.publishedAt).toLocaleDateString()}</small>` : ''}
            </td>
            <td>
                <div class="d-flex gap-2">
                    <button class="admin-btn admin-btn-warning btn-sm" onclick="editBlog('${blog.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="admin-btn admin-btn-danger btn-sm" onclick="deleteBlog('${blog.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Show blog form
function showBlogForm(blogId = null) {
    editingBlogId = blogId;
    const modal = new bootstrap.Modal(document.getElementById('blogModal'));
    const form = document.getElementById('blogForm');
    
    if (blogId) {
        document.getElementById('blogModalTitle').textContent = 'Edit Blog';
        loadBlogData(blogId);
    } else {
        document.getElementById('blogModalTitle').textContent = 'Create New Blog';
        form.reset();
        blogImageFile = null;
        existingBlogImage = null;
        if (quillEditor) {
            quillEditor.setContents([]);
        }
        document.getElementById('blogImagePreview').innerHTML = '';
    }
    
    modal.show();
}

// Load blog data for editing
async function loadBlogData(blogId) {
    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const blog = await response.json();
            
            document.getElementById('blogId').value = blog.id;
            document.getElementById('blogTitle').value = blog.title || '';
            document.getElementById('blogSlug').value = blog.slug || '';
            document.getElementById('blogExcerpt').value = blog.excerpt || '';
            document.getElementById('blogMetaTitle').value = blog.metaTitle || '';
            document.getElementById('blogMetaDescription').value = blog.metaDescription || '';
            document.getElementById('blogStatus').value = blog.status || 'draft';
            
            // Set Quill editor content
            if (quillEditor && blog.content) {
                quillEditor.root.innerHTML = blog.content;
            }
            
            // Load existing featured image
            if (blog.featuredImage) {
                existingBlogImage = blog.featuredImage;
                document.getElementById('blogImagePreview').innerHTML = `
                    <div class="image-preview-item" style="max-width: 300px;">
                        <img src="${blog.featuredImage}" alt="Featured Image">
                        <button type="button" class="remove-image" onclick="removeBlogImage()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading blog:', error);
        showAlert('Error loading blog data', 'error');
    }
}

// Handle blog image preview
function handleBlogImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        blogImageFile = file;
        existingBlogImage = null;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('blogImagePreview').innerHTML = `
                <div class="image-preview-item" style="max-width: 300px;">
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image" onclick="removeBlogImage()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }
}

// Remove blog image
function removeBlogImage() {
    blogImageFile = null;
    existingBlogImage = null;
    document.getElementById('blogFeaturedImage').value = '';
    document.getElementById('blogImagePreview').innerHTML = '';
}

// Handle blog form submission
document.getElementById('blogForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get content from Quill editor
    const content = quillEditor.root.innerHTML;
    document.getElementById('blogContent').value = content;
    
    const formData = new FormData();
    const blogId = document.getElementById('blogId').value;
    
    // Add form fields
    formData.append('title', document.getElementById('blogTitle').value);
    formData.append('slug', document.getElementById('blogSlug').value);
    formData.append('excerpt', document.getElementById('blogExcerpt').value);
    formData.append('content', content);
    formData.append('metaTitle', document.getElementById('blogMetaTitle').value);
    formData.append('metaDescription', document.getElementById('blogMetaDescription').value);
    formData.append('status', document.getElementById('blogStatus').value);
    
    // Add featured image if new one uploaded
    if (blogImageFile) {
        formData.append('featuredImage', blogImageFile);
    }

    try {
        const token = getAuthToken();
        const url = blogId 
            ? `${API_BASE_URL}/blogs/${blogId}`
            : `${API_BASE_URL}/blogs`;
        const method = blogId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (response.ok) {
            showAlert(blogId ? 'Blog updated successfully!' : 'Blog created successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('blogModal')).hide();
            loadBlogs();
            document.getElementById('blogForm').reset();
            blogImageFile = null;
            existingBlogImage = null;
            if (quillEditor) {
                quillEditor.setContents([]);
            }
            document.getElementById('blogImagePreview').innerHTML = '';
        } else {
            let errorMessage = 'Failed to save blog';
            try {
                const error = await response.json();
                errorMessage = error.error || errorMessage;
            } catch (e) {
                errorMessage = `Server error: ${response.status} ${response.statusText}`;
            }
            showAlert(errorMessage, 'error');
            console.error('Blog save error:', errorMessage);
        }
    } catch (error) {
        console.error('Error saving blog:', error);
        showAlert('Error saving blog: ' + error.message, 'error');
    }
});

// Edit blog
function editBlog(blogId) {
    showBlogForm(blogId);
}

// Delete blog
async function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog post?')) {
        return;
    }

    try {
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showAlert('Blog deleted successfully!', 'success');
            loadBlogs();
        } else {
            showAlert('Failed to delete blog', 'error');
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        showAlert('Error deleting blog', 'error');
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

// Search blogs
document.getElementById('blogSearch')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = blogs.filter(b => 
        b.title.toLowerCase().includes(searchTerm) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(searchTerm)) ||
        (b.slug && b.slug.toLowerCase().includes(searchTerm))
    );
    renderBlogs(filtered);
});

// Auto-generate slug from title
document.getElementById('blogTitle')?.addEventListener('input', (e) => {
    const slugInput = document.getElementById('blogSlug');
    if (!slugInput.value || slugInput.dataset.autoGenerated === 'true') {
        const slug = e.target.value.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        slugInput.value = slug;
        slugInput.dataset.autoGenerated = 'true';
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initQuillEditor();
    loadBlogs();
    
    // Check if URL has action=add parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add') {
        showBlogForm();
    }
});

