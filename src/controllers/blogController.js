const Blog = require('../models/Blog');
const { validationResult } = require('express-validator');

exports.createBlog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, tags } = req.body;
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const blog = await Blog.create({ 
      title: title.trim(),
      description: description.trim(),
      tags: tags ? tags.map(tag => tag.trim()) : [],
      user: req.user._id 
    });

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('user', 'name email')
      .lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, tags } = req.body;
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        description: description.trim(),
        tags: tags ? tags.map(tag => tag.trim()) : [],
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      data: blog
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const { title, tags, sort, page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const filter = {};

    if (title) {
      filter.title = { $regex: title.trim(), $options: 'i' };
    }

    if (tags) {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      if (tagsArray.length > 0) {
        filter.tags = { $in: tagsArray };
      }
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.createdAt = 1;
    else if (sort === 'desc') sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const skip = (pageNum - 1) * limitNum;
    const totalBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalBlogs / limitNum);

    const blogs = await Blog.find(filter)
      .populate('user', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: {
        blogs,
        pagination: {
          current: pageNum,
          pages: totalPages,
          limit: limitNum,
          total: totalBlogs
        }
      }
    });
  } catch (err) {
    next(err);
  }
};