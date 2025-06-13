const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// ✅ Get all products (admin-only)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Create a new product with SKU
router.post('/', async (req, res) => {
  const { name, sku, price, cost_price, stockQty } = req.body;

  try {
    // Optional: Check for duplicate SKU
    if (sku) {
      const exists = await Product.findOne({ sku });
      if (exists) return res.status(400).json({ error: 'SKU already exists' });
    }

    const product = new Product({ name, sku, price, cost_price, stockQty });
    await product.save();
    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

// ✅ Update a product (including SKU)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ✅ Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
