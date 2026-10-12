const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['listing', 'message', 'user'],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    enum: ['harassment', 'threatening', 'scam', 'prohibited', 'spam', 'inappropriate', 'other'],
    required: true,
  },
  explanation: {
    type: String,
    maxlength: 1000,
  },
  context: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'resolved', 'dismissed'],
    default: 'pending',
  },
  moderator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  decision: {
    type: String,
  },
  action: {
    type: String,
    enum: ['dismiss', 'warn', 'remove_content', 'restrict', 'temp_suspend', 'perm_suspend'],
  },
  history: [{
    moderator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: String,
    decision: String,
    reason: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
