const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/conversations', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.session.user.id;
  const conversations = await Message.aggregate([
    { $match: { $or: [{ senderId: userId }, { receiverId: userId }] } },
    { $group: {
      _id: { $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId'] },
      lastMessage: { $last: '$content' },
      lastTime: { $last: '$createdAt' },
      unread: { $sum: { $cond: [{ $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$read', false] }] }, 1, 0] } }
    }}
  ]);
  await Message.populate(conversations, { path: '_id', select: 'companyName' });
  res.json(conversations);
});

router.get('/:userId', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
  const userId = req.session.user.id;
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: req.params.userId },
      { senderId: req.params.userId, receiverId: userId }
    ]
  }).sort({ createdAt: 1 });
  await Message.updateMany({ senderId: req.params.userId, receiverId: userId, read: false }, { $set: { read: true } });
  res.json(messages);
});

router.post('/', async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    const { receiverId, content, listingId, rfqId } = req.body;
    const message = new Message({ senderId: req.session.user.id, receiverId, content, listingId, rfqId });
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
