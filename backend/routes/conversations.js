const express = require('express');
const router = express.Router();
const {
  getConversations,
  openConversation,
  getMessages,
  sendMessage,
  markConversationRead,
  getUnreadCount,
} = require('../controllers/conversationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.post('/', protect, openConversation);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);
router.put('/:id/read', protect, markConversationRead);

module.exports = router;
