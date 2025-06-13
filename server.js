const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const analyticsRoutes = require('./routes/analytics');
const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware: JSON + URL-encoded parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS: Admin panel domain (Vercel frontend)
app.use(cors({
  origin: ['https://utilitybay-admin-panel.vercel.app'], // You can add staging/local here if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Import Routes
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const blogRoutes = require('./routes/blogs');
const blogCategoryRoutes = require('./routes/blogCategories');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// ✅ Register Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ UtilityBay Backend API is running');
});

// ✅ Console: Route mount confirmations
console.log('\n📦 API Routes Mounted:');
console.log('  /api/orders          →', typeof orderRoutes);
console.log('  /api/products        →', typeof productRoutes);
console.log('  /api/coupons         →', typeof couponRoutes);
console.log('  /api/blogs           →', typeof blogRoutes);
console.log('  /api/blog-categories →', typeof blogCategoryRoutes);
console.log('  /api/auth            →', typeof authRoutes);
console.log('  /api/user            →', typeof userRoutes);
console.log('  /api/admin           →', typeof adminRoutes);
console.log('  /api/analytics       →', typeof analyticsRoutes);

// ✅ Start server
app.listen(port, () => {
  console.log(`\n🚀 UtilityBay backend running at http://localhost:${port}`);
});
