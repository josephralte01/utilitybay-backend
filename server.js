const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Route imports
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');     // ✅ NEW
const userRoutes = require('./routes/user');     // ✅ NEW

// Register routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);               // ✅ NEW
app.use('/api/user', userRoutes);               // ✅ NEW

// Health check
app.get('/', (req, res) => {
  res.send('✅ Backend API is working');
});

// Logging
console.log('📦 Mounted /api/orders    →', typeof orderRoutes);
console.log('📦 Mounted /api/products  →', typeof productRoutes);
console.log('📦 Mounted /api/coupons   →', typeof couponRoutes);
console.log('📝 Mounted /api/blogs     →', typeof blogRoutes);
console.log('🔐 Mounted /api/auth      →', typeof authRoutes);   // ✅ NEW
console.log('🙋 Mounted /api/user      →', typeof userRoutes);   // ✅ NEW

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
