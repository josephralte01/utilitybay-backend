// backend-api/routes/coupons.js
const express = require('express');
const router = express.Router();

// Mock coupons list
const validCoupons = [
  { code: 'SAVE10', discount: 10 },  // 10% off
  { code: 'FREESHIP', discount: 0 }, // For future use like free shipping
  { code: 'WELCOME50', discount: 50 }
];

// GET all available coupons (optional, for admin use)
router.get('/', (req, res) => {
  res.json(validCoupons);
});

// POST to validate a coupon
router.post('/validate', (req, res) => {
  const { code } = req.body;

  const found = validCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());

  if (found) {
    res.json({
      valid: true,
      discount: found.discount,
      message: `🎉 Coupon applied: ${found.code} for ${found.discount}% off`
    });
  } else {
    res.status(404).json({
      valid: false,
      message: '❌ Invalid coupon code'
    });
  }
});

module.exports = router;