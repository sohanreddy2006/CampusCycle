const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: 2000,
  },
  read: {
    type: Boolean,
    default: false,
  },
  reported: {
    type: Boolean,
    default: false,
  },
  reportReason: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Message', messageSchema);
