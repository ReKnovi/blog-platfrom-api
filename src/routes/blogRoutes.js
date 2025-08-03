const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { createBlogValidator, updateBlogValidator } = require('../validators/blogValidator');
const authorizeBlogOwner = require('../middlewares/authorizeBlogOwner');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, createBlogValidator, validate, blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', auth, authorizeBlogOwner, updateBlogValidator, validate, blogController.updateBlog);
router.delete('/:id', auth, authorizeBlogOwner, blogController.deleteBlog);

module.exports = router;