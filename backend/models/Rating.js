const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true,
  },
  score: {
    type: Number,
    required: [true, 'Rating score is required'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['seller', 'buyer', 'lender', 'borrower'],
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Rating', ratingSchema);
