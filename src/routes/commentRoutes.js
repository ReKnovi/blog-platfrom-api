const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { addCommentValidator, deleteCommentValidator, getCommentsValidator } = require('../validators/commentValidator');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/authMiddleware');

router.post('/:blogId', addCommentValidator, validate, commentController.addComment);
router.get('/:blogId', getCommentsValidator, validate, commentController.getCommentsByBlog);
router.delete('/:id', auth, deleteCommentValidator, validate, commentController.deleteComment);

module.exports = router;