const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  owner: {
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
    required: [true, 'Description is required'],
    maxlength: 2000,
  },
  photos: [{
    type: String,
  }],
  type: {
    type: String,
    enum: ['sell', 'rent', 'lend', 'donate'],
    required: [true, 'Listing type is required'],
  },
  price: {
    type: Number,
    min: 0,
  },
  rentPrice: {
    type: Number,
    min: 0,
  },
  rentDuration: {
    type: String,
  },
  deposit: {
    type: Number,
    min: 0,
    default: 0,
  },
  condition: {
    type: String,
    enum: ['new', 'like_new', 'good', 'fair', 'poor'],
    default: 'good',
  },
  availability: {
    type: String,
  },
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
  },
  category: {
    type: String,
  },
  subcategory: {
    type: String,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold', 'rented', 'borrowed', 'donated', 'unavailable'],
    default: 'available',
  },
  location: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  reservedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reservedUntil: {
    type: Date,
  },
}, {
  timestamps: true,
});

listingSchema.index({ title: 'text', description: 'text' });
listingSchema.index({ tags: 1 });
listingSchema.index({ domain: 1, category: 1 });
listingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Listing', listingSchema);
