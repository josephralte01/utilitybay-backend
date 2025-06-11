const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: 'Admin' },
  category: { type: String, default: null },
  tags: { type: [String], default: [] },
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Blog', blogSchema);
