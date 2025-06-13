const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({});

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalCost = orders.reduce(
      (sum, o) =>
        sum + (o.items || []).reduce((s, i) => s + (i.cost_price || 0) * i.qty, 0),
      0
    );
    const profit = totalSales - totalCost;
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;

    const regionMap = {};
    for (let o of orders) {
      const region = o.shippingAddress?.state || "Unknown";
      regionMap[region] = (regionMap[region] || 0) + 1;
    }

    const topRegions = Object.entries(regionMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([region, count]) => ({ region, count }));

    res.json({ totalSales, totalOrders, avgOrderValue, profit, topRegions });
  } catch (err) {
    console.error('❌ Error in /api/analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
