const { body } = require('express-validator');

exports.createBlogValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('tags').optional().isArray().withMessage('Tags must be an array of strings'),
];

exports.updateBlogValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
];
