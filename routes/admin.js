const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🛂 Login attempt: ${email}`);

  try {
    const user = await User.findOne({ email });
    console.log('🔎 User found:', user);

    // Check if user exists and is an admin
    if (!user || !user.isAdmin) {
      console.log('❌ Access denied: user not found or isAdmin is false');
      return res.status(403).json({ error: 'Access denied' });
    }

    // FIX: Use correct password field
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔑 Password match:', isMatch);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Sign JWT
    const token = jwt.sign({ userId: user._id, isAdmin: true }, JWT_SECRET);
    console.log('✅ Admin login success');

    res.json({ token, user: { email: user.email, name: user.name } });

  } catch (err) {
    console.error('🔥 Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
