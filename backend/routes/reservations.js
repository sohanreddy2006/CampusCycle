const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  cancelReservation,
  completeReservation,
  getListingReservations,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/listing/:listingId', getListingReservations);
router.put('/:id/cancel', protect, cancelReservation);
router.put('/:id/complete', protect, completeReservation);

module.exports = router;
