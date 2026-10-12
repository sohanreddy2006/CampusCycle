const express = require('express');
const router = express.Router();
const {
  getPopularTags,
  getTagBySlug,
  toggleFollow,
  searchTags,
  createTag,
} = require('../controllers/tagController');
const { protect } = require('../middleware/auth');

router.get('/search/:query', searchTags);
router.get('/', getPopularTags);
router.get('/:slug', getTagBySlug);
router.post('/:id/follow', protect, toggleFollow);
router.post('/', protect, createTag);

module.exports = router;
