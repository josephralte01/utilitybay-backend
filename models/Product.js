const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true }, // ✅ New field
  price: { type: Number, required: true },
  cost_price: { type: Number, required: true },
  stockQty: { type: Number, required: true, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
