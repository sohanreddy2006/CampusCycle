const express = require('express');
const router = express.Router();
const {
  createRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  getMyRequests,
  fulfillRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.get('/', getRequests);
router.get('/my', protect, getMyRequests);
router.get('/:id', getRequest);
router.post('/', protect, createRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);
router.put('/:id/fulfill', protect, fulfillRequest);

module.exports = router;
