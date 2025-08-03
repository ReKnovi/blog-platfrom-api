const mongoose = require('mongoose');
const { UserFactory, BlogFactory, CommentFactory } = require('../factories');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
require('dotenv').config();

const SEED_SIZES = {
  small: { users: 5, blogs: 10, maxComments: 5 },
  medium: { users: 15, blogs: 30, maxComments: 8 },
  large: { users: 25, blogs: 100, maxComments: 15 }
};

const seedData = async (size = 'medium') => {
  try {
    const config = SEED_SIZES[size] || SEED_SIZES.medium;
    
    console.log(`🚀 Starting ${size} database seeding...`);
    console.log(`📊 Config: ${config.users} users, ${config.blogs} blogs, max ${config.maxComments} comments per blog`);
    
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const adminUser = UserFactory.createAdmin();
    const regularUsers = UserFactory.createMany(config.users - 1);
    const allUsers = [adminUser, ...regularUsers];
    const createdUsers = await User.insertMany(allUsers);

    // Create blogs
    console.log('📝 Creating blogs...');
    const blogs = BlogFactory.createMany(createdUsers, config.blogs);
    const createdBlogs = await Blog.insertMany(blogs);

    // Create comments
    console.log('💬 Creating comments...');
    const comments = CommentFactory.createManyForBlogs(createdBlogs);
    await Comment.insertMany(comments);

    console.log(`\n✅ ${size.toUpperCase()} seeding completed!`);
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`📝 Blogs: ${createdBlogs.length}`);
    console.log(`💬 Comments: ${comments.length}`);
    console.log('\n🔑 Login: admin@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

const size = process.argv[2] || process.env.SEED_SIZE || 'medium';
seedData(size);