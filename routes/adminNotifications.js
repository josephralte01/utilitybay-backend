// routes/adminNotifications.js

const express = require('express');
const router = express.Router();
const { getUnreadOrders, markOrdersAsRead } = require('../utils/notifications');

// GET: Unread admin notifications
router.get('/', (req, res) => {
  const unread = getUnreadOrders();
  res.json(unread);
});

// POST: Mark all as read
router.post('/mark-read', (req, res) => {
  markOrdersAsRead();
  res.json({ message: '✅ All notifications marked as read' });
});

module.exports = router;
