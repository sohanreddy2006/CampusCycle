const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const { emitToUser } = require('../socket');

const isParticipant = (conversation, userId) =>
  conversation.participants.some((p) => p.toString() === userId.toString());

const findConversationForUser = async (id, userId) => {
  const conversation = await Conversation.findById(id);
  if (!conversation) return { error: { status: 404, message: 'Conversation not found' } };
  if (!isParticipant(conversation, userId)) {
    return { error: { status: 403, message: 'Not authorized' } };
  }
  return { conversation };
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('participants', 'name avatar')
      .populate('listing', 'title photos type price status')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    const ids = conversations.map((c) => c._id);
    let unreadAgg = [];
    if (ids.length > 0) {
      unreadAgg = await Message.aggregate([
        {
          $match: {
            conversation: { $in: ids },
            read: false,
            sender: { $ne: new mongoose.Types.ObjectId(String(req.user._id)) },
          },
        },
        { $group: { _id: '$conversation', count: { $sum: 1 } } },
      ]);
    }

    const unreadMap = {};
    for (const row of unreadAgg) unreadMap[row._id.toString()] = row.count;

    const result = conversations.map((c) => ({
      ...c.toObject(),
      unreadCount: unreadMap[c._id.toString()] || 0,
    }));

    res.json({ conversations: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.openConversation = async (req, res) => {
  try {
    const { userId, listingId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }
    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot start a conversation with yourself' });
    }

    const other = await User.findById(userId).select('name avatar');
    if (!other) {
      return res.status(404).json({ message: 'User not found' });
    }

    const query = { participants: { $all: [req.user._id, userId] } };
    if (listingId) query.listing = listingId;

    let conversation = await Conversation.findOne(query)
      .populate('participants', 'name avatar')
      .populate('listing', 'title photos type price status');

    if (conversation) {
      return res.json(conversation);
    }

    conversation = await Conversation.create({
      participants: [req.user._id, userId],
      ...(listingId ? { listing: listingId } : {}),
    });
    conversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name avatar')
      .populate('listing', 'title photos type price status');

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversation, error } = await findConversationForUser(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const { page = 1, limit = 50 } = req.query;
    const messages = await Message.find({ conversation: conversation._id })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Message.countDocuments({ conversation: conversation._id });

    res.json({
      messages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversation, error } = await findConversationForUser(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const content = typeof req.body.content === 'string' ? req.body.content.trim() : '';
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    if (content.length > 2000) {
      return res.status(400).json({ message: 'Message cannot exceed 2000 characters' });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.user._id,
      content,
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: content,
      lastMessageAt: message.createdAt,
    });

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');

    const other = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );
    if (other) {
      emitToUser(other.toString(), 'message:new', {
        conversationId: conversation._id,
        message: populated,
      });
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const { conversation, error } = await findConversationForUser(req.params.id, req.user._id);
    if (error) return res.status(error.status).json({ message: error.message });

    const result = await Message.updateMany(
      { conversation: conversation._id, read: false, sender: { $ne: req.user._id } },
      { $set: { read: true } }
    );

    const other = conversation.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );
    if (other) {
      emitToUser(other.toString(), 'message:read', {
        conversationId: conversation._id,
      });
    }

    res.json({ message: 'Messages marked as read', count: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id }).select('_id');
    const ids = conversations.map((c) => c._id);
    const count =
      ids.length > 0
        ? await Message.countDocuments({
            conversation: { $in: ids },
            sender: { $ne: req.user._id },
            read: false,
          })
        : 0;
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
