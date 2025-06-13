const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");

// GET: All coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

// POST: Create a new coupon
router.post("/", async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    res.status(400).json({ error: "Failed to create coupon" });
  }
});

// PUT: Update a coupon
router.put("/:id", async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update coupon" });
  }
});

// DELETE: Remove a coupon
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete coupon" });
  }
});

// POST: Validate coupon during checkout
router.post("/validate", async (req, res) => {
  const { code, userId, orderAmount } = req.body;

  try {
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      return res.status(400).json({ valid: false, reason: "Invalid or expired coupon" });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({ valid: false, reason: "Coupon expired" });
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ valid: false, reason: `Minimum order ₹${coupon.minOrderAmount} required` });
    }

    // TODO: Optionally track and check usage limits per user and globally

    // Compute final discount
    let discount = 0;
    if (coupon.type === "flat") {
      discount = coupon.discount;
    } else if (coupon.type === "percentage") {
      discount = (orderAmount * coupon.discount) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }

    res.json({
      valid: true,
      discount: Math.round(discount),
      freeShipping: coupon.freeShipping || false,
    });
  } catch (err) {
    res.status(500).json({ valid: false, reason: "Server error during validation" });
  }
});

module.exports = router;
