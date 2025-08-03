const Blog = require('../models/Blog');
const { invalidateRSSCache } = require('../middlewares/rssMiddleware');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

exports.createBlog = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;
    
    // This check is redundant since auth middleware handles it
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, 'Authentication required');
    }

    const blog = await Blog.create({ 
      title: title.trim(),
      description: description.trim(),
      tags: tags ? tags.map(tag => tag.trim()) : [],
      user: req.user._id 
    });
    
    // Invalidate RSS cache
    invalidateRSSCache(req, res, () => {});
    
    sendSuccessResponse(res, 201, blog, 'Blog created successfully');
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
      return sendErrorResponse(res, 404, 'Blog not found');
    }

    sendSuccessResponse(res, 200, blog);
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const { title, description, tags } = req.body;
    
    const updateData = {};
    
    // Only update fields that are provided
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (tags !== undefined) updateData.tags = tags ? tags.map(tag => tag.trim()) : [];
    updateData.updatedAt = Date.now();
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!blog) {
      return sendErrorResponse(res, 404, 'Blog not found');
    }

    // Invalidate RSS cache
    invalidateRSSCache(req, res, () => {});

    sendSuccessResponse(res, 200, blog, 'Blog updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return sendErrorResponse(res, 404, 'Blog not found');
    }

    // Invalidate RSS cache
    invalidateRSSCache(req, res, () => {});
    
    sendSuccessResponse(res, 200, null, 'Blog deleted successfully');
  } catch (err) {
    next(err);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const { title, tags, sort, page = 1, limit = 10 } = req.query;

    // Validate and sanitize pagination parameters
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));

    const filter = {};

    // Build search filter
    if (title) {
      filter.title = { $regex: title.trim(), $options: 'i' };
    }

    if (tags) {
      const tagsArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
      
      if (tagsArray.length > 0) {
        filter.tags = { $in: tagsArray };
      }
    }

    // Build sort option
    const sortOption = {};
    if (sort === 'asc') {
      sortOption.createdAt = 1;
    } else {
      sortOption.createdAt = -1; // Default to newest first
    }

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;
    
    // Execute queries in parallel for better performance
    const [blogs, totalBlogs] = await Promise.all([
      Blog.find(filter)
        .populate('user', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blog.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalBlogs / limitNum);

    const responseData = {
      blogs,
      pagination: {
        current: pageNum,
        pages: totalPages,
        limit: limitNum,
        total: totalBlogs,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    };

    sendSuccessResponse(res, 200, responseData);
  } catch (err) {
    next(err);
  }
};