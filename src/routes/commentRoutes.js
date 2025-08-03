const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/authMiddleware');

router.post('/:blogId', auth, commentController.addComment);
router.get('/:blogId', commentController.getCommentsByBlog);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
