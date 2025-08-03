const Blog = require('../models/Blog');

module.exports = async (req, res, next) => {
  try {
    // Check if user is authenticated and has required properties
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.user) {
      return res.status(500).json({ message: 'Blog has no associated user' });
    }

    const isOwner = blog.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Forbidden: Not allowed' });
    }

    next();
  } catch (err) {
    next(err);
  }
};