const Comment = require('../models/Comment');

exports.addComment = async (req, res, next) => {
  try {
    const { name, text } = req.body;
    const comment = await Comment.create({
      blog: req.params.blogId,
      name,
      text,
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByBlog = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
