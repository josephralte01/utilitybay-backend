const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  guestEmail: { type: String },
  products: [{ 
    productId: String, 
    name: String, 
    quantity: Number, 
    price: Number 
  }],
  totalAmount: Number,
  couponUsed: { type: String, default: null },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
