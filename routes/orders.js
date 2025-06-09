const express = require('express');
const router = express.Router();

// In-memory order list (just for demo)
const orders = [
  {
    order_id: 'ORD001',
    total_amount: 500,
    status: 'delivered'
  }
];

// ✅ GET /api/orders - Admin view
router.get('/', (req, res) => {
  res.json(orders);
});

// ✅ POST /api/orders - Customer order placement
router.post('/', (req, res) => {
  const order = req.body;
  const orderId = 'ORD' + (orders.length + 1).toString().padStart(3, '0');

  const fullOrder = {
    order_id: orderId,
    ...order,
    status: 'pending' // default status
  };

  orders.push(fullOrder);
  console.log('🆕 Order received:', fullOrder);

  res.status(201).json({
    message: '✅ Order placed successfully',
    order_id: orderId,
    tracking_token: order.guest_tracking_token || null
  });
});

module.exports = router;
