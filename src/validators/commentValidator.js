const { body, param } = require('express-validator');

exports.addCommentValidator = [
  param('blogId').isMongoId().withMessage('Invalid blog ID'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .trim(),
  body('text')
    .notEmpty()
    .withMessage('Comment text is required')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
    .trim()
];

exports.deleteCommentValidator = [
  param('id').isMongoId().withMessage('Invalid comment ID')
];

exports.getCommentsValidator = [
  param('blogId').isMongoId().withMessage('Invalid blog ID')
];