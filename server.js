// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// ✅ Apply middlewares
app.use(cors());
app.use(express.json());

// ✅ Load routes
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');

// ✅ Register routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);

// ✅ Logs
console.log('📦 Mounted route handler for /api/orders:', typeof orderRoutes);
console.log('📦 Mounted route handler for /api/products:', typeof productRoutes);
console.log('📦 Mounted route handler for /api/coupons:', typeof couponRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend API is working');
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
