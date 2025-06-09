// backend-api/routes/orders.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// In-memory stores
const orders = [];
const notifications = [];

// Email transporter (uses environment vars)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.UTILITYBAY_EMAIL,
    pass: process.env.UTILITYBAY_EMAIL_PASS
  }
});

// GET all orders
router.get('/', (req, res) => {
  res.json(orders);
});

// GET in-app notifications
router.get('/notifications', (req, res) => {
  res.json(notifications);
});

// POST a new order
router.post('/', async (req, res) => {
  const order = req.body;
  console.log('📥 Incoming raw order:', order);

  const orderId = 'ORD' + (orders.length + 1).toString().padStart(3, '0');

  const costPriceMap = {
    1: 180,
    2: 1020,
    3: 480
  };

  const itemsWithCost = order.items.map(item => ({
    ...item,
    cost_price: costPriceMap[item.id] || 0
  }));

  const fullOrder = {
    order_id: orderId,
    ...order,
    items: itemsWithCost,
    status: 'pending'
  };

  orders.push(fullOrder);
  console.log('🆕 Order received with ID:', fullOrder.order_id);

  // Add in-app admin notification
  notifications.push({
    message: `New Order: ${orderId}`,
    unread: true,
    timestamp: new Date(),
    amount: order.total_amount,
    customer: order.name
  });

  // Send confirmation email
  try {
    await transporter.sendMail({
      from: `"UtilityBay" <${process.env.UTILITYBAY_EMAIL}>`,
      to: order.email || 'backup@example.com',
      subject: `Thanks for your order! ${orderId}`,
      text: `Hi ${order.name},\n\nYour order of ₹${order.total_amount} was successfully placed. We'll notify you when it's shipped.\n\nThank you!\nUtilityBay Team`
    });

    console.log(`📧 Confirmation email sent for ${orderId}`);
  } catch (err) {
    console.error(`❌ Email failed for ${orderId}:`, err);
  }

  res.status(201).json({
    message: '✅ Order placed',
    order_id: orderId,
    tracking_token: order.guest_tracking_token
  });
});

module.exports = router;
