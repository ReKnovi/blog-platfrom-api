# Blog Platform API

A RESTful API for a blog platform with user authentication, blog management, and commenting system.

## Features

- User authentication (register/login)
- CRUD operations for blogs
- Comment system
- Blog filtering and pagination
- User authorization

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Blogs
- `GET /api/v1/blogs` - Get all blogs (with filtering and pagination)
- `POST /api/v1/blogs` - Create new blog (authenticated)
- `GET /api/v1/blogs/:id` - Get blog by ID
- `PUT /api/v1/blogs/:id` - Update blog (owner only)
- `DELETE /api/v1/blogs/:id` - Delete blog (owner only)

### Comments
- `GET /api/v1/comments/:blogId` - Get comments for a blog
- `POST /api/v1/comments/:blogId` - Add comment to blog
- `DELETE /api/v1/comments/:id` - Delete comment

## Installation

1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Start server: `npm run dev`

## Environment Variables

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-platform
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
NODE_ENV=development
```