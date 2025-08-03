# Blog Platform API

A REST API for a blog platform built with Node.js, Express.js, and MongoDB. Features user authentication, blog management, commenting system, and RSS feeds.

## Features

- User registration and authentication with JWT
- Create, read, update, and delete blog posts
- Comment system for blog posts
- RSS feed generation with filtering options
- Input validation and error handling
- Rate limiting for API protection
- Pagination and search functionality

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- Git (for cloning the repository)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-platform-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/blog-platform
   JWT_SECRET=your-very-long-random-secret-key-here
   JWT_EXPIRES_IN=1d
   BASE_URL=http://localhost:5000
   ```

   **Important Notes:**
   - Replace `MONGO_URI` with your MongoDB connection string
   - Use a strong, random JWT secret in production
   - For MongoDB Atlas, use the connection string provided by Atlas

4. **Start MongoDB**
   - If using local MongoDB: Make sure MongoDB service is running
   - If using MongoDB Atlas: Ensure your connection string is correct

5. **Seed test data (optional)**
   ```bash
   npm run seed
   ```

6. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## Project Structure

```
src/
├── controllers/        # Request handlers
│   ├── authController.js
│   ├── blogController.js
│   ├── commentController.js
│   └── rssController.js
├── models/            # Database schemas
│   ├── User.js
│   ├── Blog.js
│   └── Comment.js
├── routes/            # API route definitions
│   ├── authRoutes.js
│   ├── blogRoutes.js
│   ├── commentRoutes.js
│   └── rssRoutes.js
├── middlewares/       # Custom middleware
│   ├── authMiddleware.js
│   ├── authorizeBlogOwner.js
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   ├── rssMiddleware.js
│   └── validate.js
├── validators/        # Input validation rules
│   ├── blogValidator.js
│   └── commentValidator.js
├── factories/         # Test data generators
│   ├── UserFactory.js
│   ├── BlogFactory.js
│   └── CommentFactory.js
├── scripts/          # Utility scripts
│   ├── seedTestData.js
│   └── seedWithOptions.js
├── utils/            # Helper functions
│   └── responseHelper.js
└── app.js            # Express application setup
```

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

| Method | Endpoint | Description | Required Fields |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register new user | name, email, password |
| POST | `/auth/login` | Login user | email, password |

### Blogs

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/blogs` | Get all blogs with filtering | No |
| POST | `/blogs` | Create new blog | Yes |
| GET | `/blogs/:id` | Get single blog | No |
| PUT | `/blogs/:id` | Update blog (owner only) | Yes |
| DELETE | `/blogs/:id` | Delete blog (owner only) | Yes |

### Comments

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/comments/:blogId` | Get comments for a blog | No |
| POST | `/comments/:blogId` | Add comment to blog | No |
| DELETE | `/comments/:id` | Delete comment | Yes |

### RSS Feeds

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rss` | Get main RSS feed |
| GET | `/rss?tags=nodejs,react` | Get filtered RSS feed |
| GET | `/rss?limit=10` | Get limited RSS feed |
| GET | `/rss/category/:category` | Get category-specific feed |
| GET | `/rss/author/:authorId` | Get author-specific feed |
| GET | `/rss/tag/:tag` | Get tag-specific feed |

## Usage Examples

### Authentication

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Blog Management

**Get all blogs:**
```bash
curl http://localhost:5000/api/v1/blogs
```

**Get blogs with pagination:**
```bash
curl "http://localhost:5000/api/v1/blogs?page=1&limit=10"
```

**Search blogs by title:**
```bash
curl "http://localhost:5000/api/v1/blogs?title=javascript"
```

**Filter blogs by tags:**
```bash
curl "http://localhost:5000/api/v1/blogs?tags=nodejs,react"
```

**Create a new blog (requires authentication):**
```bash
curl -X POST http://localhost:5000/api/v1/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Getting Started with Node.js",
    "description": "A comprehensive guide to Node.js development...",
    "tags": ["nodejs", "javascript", "backend"]
  }'
```

**Update a blog:**
```bash
curl -X PUT http://localhost:5000/api/v1/blogs/BLOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Updated Title",
    "description": "Updated description..."
  }'
```
**Advanced filtering with multiple parameters:**
```bash
curl "http://localhost:5000/api/v1/blogs?title=node&tags=javascript,backend&page=2&limit=5&sort=asc"
```

### Comments

**Add a comment:**
```bash
curl -X POST http://localhost:5000/api/v1/comments/BLOG_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "text": "Great article! Thanks for sharing."
  }'
```

**Get comments for a blog:**
```bash
curl http://localhost:5000/api/v1/comments/BLOG_ID
```

### RSS Feeds

**Get RSS feed:**
```bash
curl http://localhost:5000/api/v1/rss
```

**Get filtered RSS feed:**
```bash
curl "http://localhost:5000/api/v1/rss?tags=javascript&limit=5"
```

## Query Parameters

### Blog Endpoints

- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10, max: 50)
- `title` - Search by title (case-insensitive)
- `tags` - Filter by tags (comma-separated)
- `sort` - Sort order: 'asc' or 'desc' (default: 'desc')

### RSS Endpoints

- `limit` - Number of items (default: 20, max: 100)
- `tags` - Filter by tags (comma-separated)
- `since` - ISO date string for incremental feeds

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "blogs": [...],
    "pagination": {
      "current": 1,
      "pages": 5,
      "limit": 10,
      "total": 50,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Data Seeding

The application includes data seeding capabilities for testing:

### Basic Seeding
```bash
# Seed with default data (16 users, 50 blogs)
npm run seed
```

### Advanced Seeding Options
```bash
# Small dataset
node src/scripts/seedWithOptions.js small

# Medium dataset
node src/scripts/seedWithOptions.js medium

# Large dataset
node src/scripts/seedWithOptions.js large
```

### Test Credentials
After seeding, you can use these credentials:
- **Admin**: `admin@example.com` / `password123`
- **Regular users**: Check console output for generated emails / `password123`

## Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm run seed       # Seed database with test data
npm run seed:dev   # Seed database and start development server
```

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Error handling without data exposure

## Error Handling

The API includes comprehensive error handling for:
- Invalid MongoDB ObjectIds
- Duplicate field values
- Validation errors
- JWT token issues
- Authentication failures
- Authorization errors

## Rate Limiting

The API implements rate limiting to prevent abuse:
- General endpoints: 100 requests per 15 minutes per IP
- All endpoints are protected by the same rate limit

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| PORT | Server port | 5000 | No |
| MONGO_URI | MongoDB connection string | - | Yes |
| JWT_SECRET | JWT signing secret | - | Yes |
| JWT_EXPIRES_IN | JWT expiration time | 1d | No |
| BASE_URL | Base URL for RSS feeds | http://localhost:5000 | No |

## Troubleshooting

### Common Issues

1. **MongoDB connection failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity for Atlas

2. **JWT token errors**
   - Ensure JWT_SECRET is set in `.env`
   - Check token format in Authorization header

3. **Rate limit exceeded**
   - Wait 15 minutes or restart server in development
   - Check rate limiting configuration

4. **Validation errors**
   - Verify request body format
   - Check required fields in API documentation
