const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'LED Strip Light', price: 299 },
    { id: 2, name: 'Smart Watch', price: 1499 },
    { id: 3, name: 'Wireless Earbuds', price: 799 }
  ]);
});

module.exports = router;
