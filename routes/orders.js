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

// GET all orders (admin view)
router.get('/', (req, res) => {
  res.json(orders);
});

// GET in-app notifications (admin use)
router.get('/notifications', (req, res) => {
  res.json(notifications);
});

// ✅ NEW: Guest order tracking
router.get('/track/:token', (req, res) => {
  const { token } = req.params;
  const guestOrder = orders.find(o => o.guest_tracking_token === token);

  if (!guestOrder) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Only expose public info
  const publicDetails = {
    order_id: guestOrder.order_id,
    name: guestOrder.name,
    status: guestOrder.status,
    items: guestOrder.items.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    })),
    total_amount: guestOrder.total_amount,
    placed_on: guestOrder.created_at || new Date().toISOString()
  };

  res.json(publicDetails);
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
    status: 'pending',
    created_at: new Date().toISOString()
  };

  orders.push(fullOrder);
  console.log('🆕 Order received with ID:', fullOrder.order_id);

  // Add admin in-app notification
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
