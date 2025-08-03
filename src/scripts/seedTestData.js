const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { UserFactory, BlogFactory, CommentFactory } = require('../factories');
require('dotenv').config();

const seedData = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});

    // Create users using factory
    console.log('👥 Creating users...');
    const adminUser = UserFactory.createAdmin();
    const regularUsers = UserFactory.createMany(15); // Create 15 users
    
    const allUsers = [adminUser, ...regularUsers];
    const createdUsers = await User.insertMany(allUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create blogs using factory
    console.log('📝 Creating blog posts...');
    const blogs = BlogFactory.createMany(createdUsers, 50); // Create 50 blogs
    const createdBlogs = await Blog.insertMany(blogs);
    console.log(`✅ Created ${createdBlogs.length} blog posts`);

    // Create comments using factory
    console.log('💬 Creating comments...');
    const comments = CommentFactory.createManyForBlogs(createdBlogs);
    const createdComments = await Comment.insertMany(comments);
    console.log(`✅ Created ${createdComments.length} comments`);

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`📝 Blogs: ${createdBlogs.length}`);
    console.log(`💬 Comments: ${createdComments.length}`);
    console.log('\n🎉 Database seeding completed successfully!');
    
    // Display sample credentials
    console.log('\n🔑 Sample Login Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log(`Sample User: ${createdUsers[1].email} / password123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();