const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500,
  },
  phone: {
    type: String,
    default: '',
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['student', 'moderator', 'admin'],
    default: 'student',
  },
  reputation: {
    rating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    completedExchanges: { type: Number, default: 0 },
    listings: { type: Number, default: 0 },
  },
  followedTags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  suspendedUntil: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
