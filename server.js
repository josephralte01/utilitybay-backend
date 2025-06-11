const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ CORS: Allow only Vercel admin panel domain
app.use(cors({
  origin: ['https://utilitybay-admin-panel.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Middleware to parse incoming JSON requests (IMPORTANT: must be before routes)
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Import Routes
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// ✅ Register Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('✅ UtilityBay Backend API is running');
});

// ✅ Logging mounts
console.log('📦 Mounted /api/orders    →', typeof orderRoutes);
console.log('📦 Mounted /api/products  →', typeof productRoutes);
console.log('📦 Mounted /api/coupons   →', typeof couponRoutes);
console.log('📝 Mounted /api/blogs     →', typeof blogRoutes);
console.log('🔐 Mounted /api/auth      →', typeof authRoutes);
console.log('🙋 Mounted /api/user      →', typeof userRoutes);
console.log('🛡️  Mounted /api/admin     →', typeof adminRoutes);

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 UtilityBay backend running on http://localhost:${port}`);
});
