const express = require('express');
const router = express.Router();
const rssController = require('../controllers/rssController');

router.get('/', rssController.getRSSFeed);
router.get('/category/:category', rssController.getCategoryRSSFeed);
router.get('/author/:authorId', rssController.getAuthorRSSFeed);
router.get('/tag/:tag', rssController.getTagRSSFeed);

module.exports = router;