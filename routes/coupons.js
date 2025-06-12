const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// ✅ Get all coupons
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

// ✅ Create a new coupon
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    const { code, discount, type } = req.body;
    const exists = await Coupon.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(409).json({ error: 'Coupon already exists' });

    const newCoupon = new Coupon({ code, discount, type });
    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created', coupon: newCoupon });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create coupon' });
  }
});

// ✅ Delete a coupon
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// ✅ Validate a coupon (for frontend checkout)
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
    }

    res.json({
      valid: true,
      discount: coupon.discount,
      type: coupon.type,
      message: `🎉 Coupon applied: ${coupon.code} for ${coupon.discount}${coupon.type === 'percent' ? '%' : '₹'} off`,
    });
  } catch (err) {
    res.status(500).json({ valid: false, message: 'Error validating coupon' });
  }
});

module.exports = router;
