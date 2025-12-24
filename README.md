# BABISHA Collections - Admin Panel

E-commerce admin panel for managing products and blogs with Supabase backend.

## 🚀 Features

- ✅ Product Management (CRUD operations)
- ✅ Blog Management (CRUD operations)
- ✅ Image Upload to Supabase Storage
- ✅ Admin Authentication
- ✅ Dashboard with Statistics
- ✅ Supabase PostgreSQL Database
- ✅ Responsive Admin Interface

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## 🔧 Setup

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd BABISHA
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_service_role_key
SUPABASE_DB_URL=your_database_connection_string
PORT=3001
JWT_SECRET=your-secret-key
```

**Get these values from:**
- Supabase Dashboard → Settings → API (for URL and Service Key)
- Supabase Dashboard → Settings → Database → Connection String (Session Pooler)

### 4. Setup Database

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase-schema.sql`
3. Paste and run in SQL Editor

### 5. Create Storage Buckets

In Supabase Dashboard → Storage:
- Create bucket: `products` (Public)
- Create bucket: `blogs` (Public)

### 6. Start Server

```bash
node server.js
```

Server will run on: http://localhost:3001

## 🔐 Admin Login

- **URL:** http://localhost:8000/admin/login.html
- **Email:** admin@babisha.com
- **Password:** admin123

## 📁 Project Structure

```
BABISHA/
├── admin/              # Admin panel frontend
├── public/             # Public frontend
├── server.js           # Express backend server
├── database.js         # Supabase database operations
├── storage-service.js  # Supabase Storage operations
├── supabase-config.js  # Supabase configuration
├── supabase-schema.sql # Database schema
└── .env                # Environment variables (not in git)
```

## 🗄️ Database Schema

- `admin_users` - Admin login credentials
- `products` - Product information
- `product_images` - Multiple images per product
- `blogs` - Blog posts

## 🚀 Deployment

### Deploy to Vercel/Netlify

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables in deployment settings
4. Deploy!

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_DB_URL`
- `PORT` (optional, defaults to 3001)
- `JWT_SECRET` (use a strong secret in production)

## 📝 API Endpoints

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/blogs` - Get all blogs
- `POST /api/admin/blogs` - Create blog
- `PUT /api/admin/blogs/:id` - Update blog
- `DELETE /api/admin/blogs/:id` - Delete blog

### Public Endpoints
- `GET /api/products` - Get active products
- `GET /api/products/:id` - Get single product
- `GET /api/blogs` - Get published blogs
- `GET /api/blogs/:slug` - Get single blog

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ JWT authentication for admin routes
- ✅ Password hashing with bcrypt
- ✅ Service Role Key for admin operations

## 📦 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage
- **Authentication:** JWT
- **Frontend:** HTML, CSS, JavaScript

## 📄 License

Private project - All rights reserved

## 👤 Author

BABISHA Collections

---

**Note:** Make sure to never commit `.env` file or `supabase-config.js` with actual credentials to GitHub!
