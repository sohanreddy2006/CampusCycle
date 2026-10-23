const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
  },
  lastMessage: {
    type: String,
  },
  lastMessageAt: {
    type: Date,
  },
}, { timestamps: true });

conversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
