const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ✅ Load the router from routes/orders.js
const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);
console.log('📦 Mounted route handler for /api/orders:', typeof orderRoutes);

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
app.get('/', (req, res) => {
  res.send('✅ Backend API is working');
});
