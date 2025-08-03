const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.index({ blog: 1, createdAt: -1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ name: 1 });

module.exports = mongoose.model('Comment', commentSchema);
