# BABISHA Admin Panel

A secure, full-featured admin panel for managing products (dresses) and blog posts, perfectly matching the BABISHA website design system.

## 🚀 Features

### ✅ Admin Authentication
- Secure login with JWT tokens
- Role-based access control (Admin only)
- Protected routes
- Session management

### ✅ Dashboard
- Overview cards showing:
  - Total Dresses
  - Total Blogs
  - Active Products
  - Revenue (optional)
- Quick action buttons
- Real-time statistics

### ✅ Product Management
- **Create** new products with:
  - Product name, category, description
  - Price management (price, original price, discount price)
  - Multiple image uploads (up to 10 images)
  - Stock availability
  - Product specifications (JSON)
  - Rating and reviews
  - Sale status
- **Edit** existing products
- **Delete** products
- **Enable/Disable** product visibility
- Real-time updates on frontend

### ✅ Blog Management
- **Create** blog posts with:
  - Title and slug (auto-generated)
  - Rich text content editor (Quill)
  - Featured image upload
  - SEO meta title & description
  - Excerpt
  - Publish/Draft status
- **Edit** blog posts
- **Delete** blog posts
- Blogs automatically appear on website when published

### ✅ Media Management
- Image upload with preview
- Optimized image storage
- Reusable uploaded images
- Image deletion

### ✅ Design Matching
- Uses existing website design system:
  - Same color palette (Deep Maroon, Crimson, Gold)
  - Same fonts (Playfair Display, Inter)
  - Same button styles
  - Same card layouts
  - Same spacing system
- Fully responsive (desktop-first)

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Backend Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the Admin Panel**
   - Open your browser and navigate to: `http://localhost:8000/admin/login.html`
   - Default credentials:
     - **Email:** `admin@babisha.com`
     - **Password:** `admin123`

   ⚠️ **Important:** Change the default password after first login!

## 📁 Project Structure

```
BABISHA/
├── admin/                    # Admin panel frontend
│   ├── login.html            # Admin login page
│   ├── dashboard.html        # Admin dashboard
│   ├── products.html         # Product management
│   ├── blogs.html            # Blog management
│   ├── admin-styles.css      # Admin panel styles
│   ├── admin-auth.js         # Authentication logic
│   ├── admin-dashboard.js    # Dashboard logic
│   ├── admin-products.js     # Product management logic
│   └── admin-blogs.js        # Blog management logic
├── server.js                 # Express.js backend server
├── package.json              # Node.js dependencies
├── data/                     # JSON database (auto-created)
│   ├── products.json         # Products data
│   ├── blogs.json            # Blogs data
│   └── admin.json            # Admin users data
└── uploads/                  # Uploaded images (auto-created)
    ├── products/             # Product images
    └── blogs/                 # Blog featured images
```

## 🔧 Configuration

### Backend Server
- **Port:** 3001 (default)
- **JWT Secret:** Change `JWT_SECRET` in `server.js` for production
- **File Upload Limit:** 10MB per file

### API Endpoints

#### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify token

#### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

#### Products
- `GET /api/admin/products` - Get all products
- `GET /api/admin/products/:id` - Get single product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

#### Blogs
- `GET /api/admin/blogs` - Get all blogs
- `GET /api/admin/blogs/:id` - Get single blog
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

#### Public APIs (for frontend)
- `GET /api/products` - Get active products
- `GET /api/blogs` - Get published blogs
- `GET /api/blogs/:slug` - Get single blog by slug

## 🔐 Security

### Current Implementation
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- File upload validation

### Production Recommendations
1. **Change JWT Secret:** Update `JWT_SECRET` in `server.js`
2. **Change Default Password:** Change admin password after first login
3. **Use HTTPS:** Deploy with SSL certificate
4. **Environment Variables:** Move secrets to `.env` file
5. **Rate Limiting:** Add rate limiting to prevent brute force
6. **CORS Configuration:** Restrict CORS to your domain
7. **Input Validation:** Add more server-side validation
8. **File Upload Security:** Add virus scanning for uploads

## 🎨 Design System

The admin panel uses the same design system as the main website:

### Colors
- **Primary:** `#8B0000` (Deep Maroon)
- **Secondary:** `#DC143C` (Crimson)
- **Accent:** `#B22222` (Fire Brick)
- **Gold:** `#DAA520` (Goldenrod)

### Fonts
- **Headings:** Playfair Display
- **Body:** Inter

### Components
- Cards with rounded corners (15px)
- Smooth transitions (0.4s cubic-bezier)
- Shadow effects matching main site
- Button styles consistent with website

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop:** Full sidebar navigation
- **Tablet:** Collapsible sidebar
- **Mobile:** Hamburger menu toggle

## 🛠️ Development

### Running in Development Mode
```bash
npm run dev
```

This uses `nodemon` to auto-reload the server on file changes.

### Adding New Features

1. **New API Route:** Add to `server.js`
2. **New Admin Page:** Create HTML file in `admin/` folder
3. **New JavaScript:** Create JS file and link in HTML
4. **Styling:** Add to `admin-styles.css` following design system

## 📝 Usage Guide

### Managing Products

1. **Add Product:**
   - Go to Products page
   - Click "Add New Product"
   - Fill in all required fields
   - Upload product images
   - Set price and stock
   - Click "Save Product"

2. **Edit Product:**
   - Find product in table
   - Click edit icon
   - Modify fields
   - Click "Save Product"

3. **Delete Product:**
   - Find product in table
   - Click delete icon
   - Confirm deletion

### Managing Blogs

1. **Create Blog:**
   - Go to Blogs page
   - Click "Create New Blog"
   - Enter title (slug auto-generates)
   - Write content using rich text editor
   - Upload featured image
   - Set SEO meta data
   - Choose Draft or Published status
   - Click "Save Blog"

2. **Publish Blog:**
   - Edit blog post
   - Change status to "Published"
   - Blog will appear on website automatically

## 🔄 Integration with Frontend

The admin panel automatically updates the frontend:

1. **Products:** When a product is created/updated, it's immediately available via `/api/products`
2. **Blogs:** When a blog is published, it appears via `/api/blogs`

To integrate with your frontend:

```javascript
// Fetch products
fetch('http://localhost:3001/api/products')
    .then(res => res.json())
    .then(products => {
        // Display products
    });

// Fetch blogs
fetch('http://localhost:3001/api/blogs')
    .then(res => res.json())
    .then(blogs => {
        // Display blogs
    });
```

## 🐛 Troubleshooting

### Server won't start
- Check if port 3001 is available
- Ensure Node.js is installed
- Run `npm install` to install dependencies

### Can't login
- Check if server is running
- Verify default credentials
- Check browser console for errors

### Images not uploading
- Check `uploads/` directory permissions
- Verify file size is under 10MB
- Check file type is image (jpg, png, gif, webp)

### API errors
- Check server console for error messages
- Verify JWT token is valid
- Check API endpoint URLs

## 📄 License

This admin panel is part of the BABISHA project.

## 🤝 Support

For issues or questions:
- Email: btdesigners555@gmail.com
- Phone: +91 9624113555

---

**Note:** This is a development version. For production deployment, follow security recommendations and use environment variables for sensitive data.

