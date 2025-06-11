const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// ✅ Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// ✅ Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching blog' });
  }
});

// ✅ Create new blog
router.post('/', async (req, res) => {
  const { title, content, author, category, tags } = req.body;

  try {
    const blog = new Blog({ title, content, author, category, tags });
    await blog.save();
    res.status(201).json({ message: 'Blog created', blog });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create blog', details: err });
  }
});

// ✅ Update blog
router.put('/:id', async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog updated', blog: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// ✅ Delete blog
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

module.exports = router;
