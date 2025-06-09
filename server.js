const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ✅ Load routes
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');  // <-- Add this line

// ✅ Register routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);             // <-- Add this line

console.log('📦 Mounted route handler for /api/orders:', typeof orderRoutes);
console.log('📦 Mounted route handler for /api/products:', typeof productRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend API is working');
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
