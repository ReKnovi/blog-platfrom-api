const Blog = require('../models/Blog');
const { sendErrorResponse } = require('../utils/responseHelper');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      return sendErrorResponse(res, 401, 'Authentication required');
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return sendErrorResponse(res, 404, 'Blog not found');
    }

    if (!blog.user) {
      return sendErrorResponse(res, 500, 'Blog has no associated user');
    }

    const isOwner = blog.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return sendErrorResponse(res, 403, 'Access denied. You can only modify your own blogs');
    }

    next();
  } catch (err) {
    next(err);
  }
};