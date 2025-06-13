// models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["flat", "percentage"], required: true },
  discount: { type: Number, required: true }, // flat amount or percentage value
  maxDiscount: { type: Number }, // cap for percentage discounts
  minOrderAmount: { type: Number }, // required for coupon to be valid
  usageLimit: { type: Number }, // total usage limit for all users
  usagePerUser: { type: Number }, // how many times a user can use it
  expiresAt: { type: Date }, // expiration date
  freeShipping: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Coupon", couponSchema);
