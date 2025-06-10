const express = require('express');
const router = express.Router();

let blogs = [
  {
    id: 1,
    title: 'Welcome to UtilityBay!',
    content: 'This is your first blog post. You can manage blogs from the admin panel.',
    author: 'Admin',
    created_at: new Date().toISOString()  // 🛠 Use ISO format
  }
];

// ✅ GET all blogs
router.get('/', (req, res) => {
  res.json(blogs);
});

// ✅ GET a single blog by ID
router.get('/:id', (req, res) => {
  const blog = blogs.find(b => b.id === parseInt(req.params.id));
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

// ✅ POST create new blog
router.post('/', (req, res) => {
  const { title, content, author } = req.body;

  const newBlog = {
    id: blogs.length + 1,
    title,
    content,
    author,
    created_at: new Date().toISOString()  // 🛠 Consistent ISO string
  };

  blogs.push(newBlog);
  res.status(201).json({ message: 'Blog created', blog: newBlog });
});

// ✅ PUT update blog by ID
router.put('/:id', (req, res) => {
  const blog = blogs.find(b => b.id === parseInt(req.params.id));
  if (!blog) return res.status(404).json({ error: 'Blog not found' });

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;
  blog.author = req.body.author || blog.author;
  res.json({ message: 'Blog updated', blog });
});

// ✅ DELETE a blog
router.delete('/:id', (req, res) => {
  blogs = blogs.filter(b => b.id !== parseInt(req.params.id));
  res.json({ message: 'Blog deleted' });
});

module.exports = router;
