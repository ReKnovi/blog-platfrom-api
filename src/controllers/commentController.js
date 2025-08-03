const Comment = require('../models/Comment');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

exports.addComment = async (req, res, next) => {
  try {
    const { name, text } = req.body;
    
    const comment = await Comment.create({
      blog: req.params.blogId,
      name: name.trim(),
      text: text.trim(),
    });

    sendSuccessResponse(res, 201, comment, 'Comment added successfully');
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByBlog = async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.blogId })
      .sort({ createdAt: -1 })
      .lean();

    sendSuccessResponse(res, 200, comments);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const deleted = await Comment.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return sendErrorResponse(res, 404, 'Comment not found');
    }

    sendSuccessResponse(res, 200, null, 'Comment deleted successfully');
  } catch (err) {
    next(err);
  }
};