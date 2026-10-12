const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  updateStatus,
  getMyListings,
  getListingsByDomain,
} = require('../controllers/listingController');
const { protect } = require('../middleware/auth');

router.get('/', getListings);
router.get('/my', protect, getMyListings);
router.get('/:id', getListing);
router.post('/', protect, createListing);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);
router.put('/:id/status', protect, updateStatus);
router.get('/domain/:domainId', getListingsByDomain);

module.exports = router;
