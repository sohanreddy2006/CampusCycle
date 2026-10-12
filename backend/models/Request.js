const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    maxlength: 2000,
  },
  type: {
    type: String,
    enum: ['buy', 'rent', 'borrow'],
    required: [true, 'Request type is required'],
  },
  requiredDate: {
    type: Date,
  },
  duration: {
    type: String,
  },
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
  },
  category: {
    type: String,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['active', 'matched', 'fulfilled', 'expired', 'cancelled'],
    default: 'active',
  },
  matchedListing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Request', requestSchema);
