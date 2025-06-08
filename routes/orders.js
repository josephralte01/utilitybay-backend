const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      order_id: 'ORD001',
      total_amount: 500,
      status: 'delivered'
    }
  ]);
});

module.exports = router;
