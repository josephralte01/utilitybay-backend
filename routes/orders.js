const express = require('express');
const router = express.Router();

// In-memory orders store
const orders = [];

// ✅ GET route (admin view)
router.get('/', (req, res) => {
  res.json(orders);
});

// ✅ POST route (customer checkout)
router.post('/', (req, res) => {
  const order = req.body;
  console.log('📥 Incoming raw order:', order); // <-- YOUR LINE GOES HERE

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

  res.status(201).json({
    message: '✅ Order placed',
    order_id: orderId,
    tracking_token: order.guest_tracking_token
  });
});

module.exports = router;
