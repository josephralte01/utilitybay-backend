// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Route imports
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');

// ✅ Register routes
app.use('/api/orders', orderRoutes);          // Order handling (includes /notifications)
app.use('/api/products', productRoutes);      // Product list
app.use('/api/coupons', couponRoutes);        // Coupon validation

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Backend API is working');
});

// ✅ Logging routes
console.log('📦 Mounted /api/orders    →', typeof orderRoutes);
console.log('📦 Mounted /api/products  →', typeof productRoutes);
console.log('📦 Mounted /api/coupons   →', typeof couponRoutes);

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
