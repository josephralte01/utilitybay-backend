const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'LED Strip Light', price: 299, cost_price: 180 },
    { id: 2, name: 'Smart Watch', price: 1499, cost_price: 1020 },
    { id: 3, name: 'Wireless Earbuds', price: 799, cost_price: 480 }
  ]);
});

module.exports = router;
