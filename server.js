const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables

const app = express();
const port = 5000;

// ✅ Connect to MongoDB Atlas (clean version)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Route imports
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// Register routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ Backend API is working');
});

// Logging
console.log('📦 Mounted /api/orders    →', typeof orderRoutes);
console.log('📦 Mounted /api/products  →', typeof productRoutes);
console.log('📦 Mounted /api/coupons   →', typeof couponRoutes);
console.log('📝 Mounted /api/blogs     →', typeof blogRoutes);
console.log('🔐 Mounted /api/auth      →', typeof authRoutes);
console.log('🙋 Mounted /api/user      →', typeof userRoutes);
console.log('🛡️  Mounted /api/admin     →', typeof adminRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
