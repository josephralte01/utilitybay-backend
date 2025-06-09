const express = require('express');
const router = express.Router();

// In-memory orders store
const orders = [];

router.get('/', (req, res) => {
  res.json(orders);
});

router.post('/', (req, res) => {
  const order = req.body;
  const orderId = 'ORD' + (orders.length + 1).toString().padStart(3, '0');

  // Inject cost_price into each item (mock, based on id)
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
  console.log('🆕 Order received:', fullOrder);

  res.status(201).json({
    message: '✅ Order placed',
    order_id: orderId,
    tracking_token: order.guest_tracking_token
  });
});

module.exports = router;
