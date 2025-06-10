const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const orders = [];
const notifications = [];

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

// GET admin notifications
router.get('/notifications', (req, res) => {
  res.json(notifications);
});

// ✅ Regional Best-Sellers
router.get('/top-regions', (req, res) => {
  const regionStats = {};

  orders.forEach(order => {
    const region = extractRegion(order.address || 'Unknown');
    if (!regionStats[region]) regionStats[region] = { totalItems: 0, products: {} };

    order.items.forEach(item => {
      const key = item.name;
      regionStats[region].products[key] = (regionStats[region].products[key] || 0) + (item.quantity || 1);
      regionStats[region].totalItems += item.quantity || 1;
    });
  });

  const formatted = Object.entries(regionStats).map(([region, data]) => {
    const topItems = Object.entries(data.products)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, qty]) => ({ name, sold: qty }));

    return {
      region,
      totalItems: data.totalItems,
      topProducts: topItems
    };
  });

  res.json(formatted);
});

// ✅ Average Order Value
router.get('/average-order-value', (req, res) => {
  if (orders.length === 0) {
    return res.json({ average_order_value: 0 });
  }

  const total = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const average = total / orders.length;

  res.json({
    average_order_value: parseFloat(average.toFixed(2)),
    total_orders: orders.length
  });
});

// ✅ Profit Tracking
router.get('/profit-summary', (req, res) => {
  let revenue = 0;
  let cost = 0;

  orders.forEach(order => {
    revenue += order.total_amount || 0;

    order.items.forEach(item => {
      const qty = item.quantity || 1;
      const itemCost = (item.cost_price || 0) * qty;
      cost += itemCost;
    });
  });

  const profit = revenue - cost;

  res.json({
    total_revenue: revenue,
    total_cost: cost,
    total_profit: profit,
    number_of_orders: orders.length
  });
});

// ✅ Guest tracking
router.get('/track/:token', (req, res) => {
  const { token } = req.params;
  const guestOrder = orders.find(o => o.guest_tracking_token === token);

  if (!guestOrder) return res.status(404).json({ error: 'Order not found' });

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

// ✅ Place new order
router.post('/', async (req, res) => {
  const order = req.body;
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
    created_at: new Date().toISOString(),
    region: extractRegion(order.address || '')
  };

  orders.push(fullOrder);

  notifications.push({
    message: `New Order: ${orderId}`,
    unread: true,
    timestamp: new Date(),
    amount: order.total_amount,
    customer: order.name
  });

  try {
    await transporter.sendMail({
      from: `"UtilityBay" <${process.env.UTILITYBAY_EMAIL}>`,
      to: order.email || 'backup@example.com',
      subject: `Thanks for your order! ${orderId}`,
      text: `Hi ${order.name},\n\nYour order of ₹${order.total_amount} was successfully placed. We'll notify you when it's shipped.\n\nThank you!\nUtilityBay Team`
    });
  } catch (err) {
    console.error(`❌ Email failed for ${orderId}:`, err);
  }

  res.status(201).json({
    message: '✅ Order placed',
    order_id: orderId,
    tracking_token: order.guest_tracking_token
  });
});

// 🧠 Region extractor
function extractRegion(address) {
  if (!address || typeof address !== 'string') return 'Unknown';
  const parts = address.split(',');
  return parts[parts.length - 1].trim() || 'Unknown';
}

module.exports = router;
