const express = require('express');
const router = express.Router();
const BlogCategory = require('../models/BlogCategory');

// ✅ Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ✅ Create new category
router.post('/', async (req, res) => {
  const { name, slug } = req.body;

  try {
    const existing = await BlogCategory.findOne({ slug });
    if (existing) return res.status(400).json({ error: 'Slug already exists' });

    const newCategory = new BlogCategory({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-')
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category created', category: newCategory });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// ✅ Delete category
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BlogCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
