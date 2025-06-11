router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🔐 Admin login attempt for ${email}`);

  try {
    const user = await User.findOne({ email });
    console.log('👤 Found user:', user);

    if (!user || !user.isAdmin) {
      console.log('❌ Not an admin or user not found');
      return res.status(403).json({ error: 'Access denied' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('🔑 Password match?', isMatch);

    if (!isMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, isAdmin: true }, JWT_SECRET);
    console.log('✅ Admin login successful');
    res.json({ token, user: { email: user.email, name: user.name } });

  } catch (err) {
    console.error('🔥 Server error during admin login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
