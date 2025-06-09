const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// In-memory orders store
const orders = [];
const notifications = []; // Optional: For admin in-app display

// Email setup (use environment variables or replace directly for testing)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.UTILITYBAY_EMAIL,       // e.g., utilitybay@gmail.com
    pass: process.env.UTILITYBAY_EMAIL_PASS   // App password (not your Gmail password)
  }
});

// ✅ GET route for orders (admin view)
router.get('/', (req, res) => {
  res.json(orders);
});

// ✅ GET route for notifications (optional admin use)
router.get('/notifications', (req, res) => {
  res.json(notifications);
});

// ✅ POST route for placing an order
router.post('/', async (req, res) => {
  const order = req.body;
  console.log('📥 Incoming raw order:', order);

  const orderId = 'ORD' + (orders.length + 1).toString().padStart(3, '0');

  // Mock cost prices
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

  // ✅ Add to in-app notifications (optional admin panel future use)
  notifications.push({
    message: `New Order Placed – ${orderId}`,
    timestamp: new Date(),
    phone: order.phone,
    amount: order.total_amount
  });

  // ✅ Send email confirmation
  try {
    await transporter.sendMail({
      from: `"UtilityBay" <${process.env.UTILITYBAY_EMAIL}>`,
      to: order.email || 'backup@example.com', // You may replace this fallback
      subject: `Your Order ${orderId} has been received!`,
      text: `Hi ${order.name},\n\nThank you for shopping with UtilityBay!\n\nYour order ${orderId} totaling ₹${order.total_amount} has been placed successfully.\n\nWe'll keep you updated when it's out for delivery.\n\n– Team UtilityBay`,
    });

    console.log(`📧 Email sent for ${orderId}`);
  } catch (err) {
    console.error(`❌ Email sending failed:`, err);
  }

  res.status(201).json({
    message: '✅ Order placed',
    order_id: orderId,
    tracking_token: order.guest_tracking_token
  });
});

module.exports = router;
