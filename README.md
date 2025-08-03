# Blog Platform API

A simple REST API for a blog platform built with Node.js, Express, and MongoDB. This project includes user authentication, blog management, and a commenting system.

## Features

- User registration and login
- Create, read, update, delete blog posts  
- Add comments to blog posts
- RSS feed for blog posts
- Basic authentication and authorization

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blog-platform
   JWT_SECRET=your-secret-key
   ```

3. **Start MongoDB** (make sure MongoDB is running on your system)

4. **Seed test data** (optional)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Blogs
- `GET /api/v1/blogs` - Get all blogs
- `POST /api/v1/blogs` - Create new blog (requires auth)
- `GET /api/v1/blogs/:id` - Get single blog
- `PUT /api/v1/blogs/:id` - Update blog (owner only)
- `DELETE /api/v1/blogs/:id` - Delete blog (owner only)

### Comments
- `GET /api/v1/comments/:blogId` - Get comments for a blog
- `POST /api/v1/comments/:blogId` - Add comment to blog

### RSS
- `GET /api/v1/rss` - Get RSS feed
- `GET /api/v1/rss?tags=nodejs,react` - Get RSS feed filtered by tags
- `GET /api/v1/rss?limit=10` - Get RSS feed with limited results
- `GET /api/v1/rss/category/:category` - Get category-specific feed
- `GET /api/v1/rss/author/:authorId` - Get author-specific feed


## for better RSS visualization 
Install an RSS viewer extension:
- RSS Feed Reader - (Chrome)
- Smart RSS Reader - (Firefox)

Then visit:
http://localhost:5000/api/v1/rss

## Usage Examples

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"123456"}'
```

**Create Blog:**
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My Blog","description":"Blog content","tags":["nodejs"]}'
```

## Test Data

Run `npm run seed` to generate test data:
- 9 users (1 admin + 8 regular users)
- 20 blog posts with random content
- Comments on each blog post

Login with: `admin@test.com` / `password123`

## Project Structure

```
src/
├── controllers/     # Route handlers
├── models/         # Database models  
├── routes/         # API routes
├── middlewares/    # Custom middleware
├── validators/     # Input validation
└── scripts/        # Utility scripts
```

## Scripts

```bash
npm start       # Start server
npm run dev     # Start with nodemon
npm run seed    # Seed test data
```
### Advanced Seeding Options
```bash
# Small dataset (5 users, 10 blogs)
node src/scripts/seedWithOptions.js small

# Medium dataset (15 users, 30 blogs)
node src/scripts/seedWithOptions.js medium

# Large dataset (25 users, 100 blogs)
node src/scripts/seedWithOptions.js large
```