const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'completed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);
