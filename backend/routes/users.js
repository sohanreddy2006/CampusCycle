const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateAvatar,
  getPublicProfile,
  getUserListings,
  getMyListings,
  getWishlist,
  getWishlistCount,
  addToWishlist,
  getFollowedTags,
  getHistory,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, updateAvatar);

router.get('/me/wishlist', protect, getWishlist);
router.get('/me/following', protect, getFollowedTags);
router.get('/me/history', protect, getHistory);
router.get('/me/listings', protect, getMyListings);
router.get('/me/wishlist/count', protect, getWishlistCount);

router.get('/:id', getPublicProfile);
router.get('/:id/listings', getUserListings);
router.post('/wishlist/:listingId', protect, addToWishlist);

module.exports = router;
