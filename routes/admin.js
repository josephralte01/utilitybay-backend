router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`🛂 Login attempt: ${email}`);

  try {
    const user = await User.findOne({ email });
    console.log('🔎 User found:', user);

    if (!user || !user.isAdmin) {
      console.log('❌ Access denied: user not found or isAdmin is false');
      return res.status(403).json({ error: 'Access denied' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    console.log('🔑 Password match:', isMatch);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, isAdmin: true }, JWT_SECRET);
    console.log('✅ Admin login success');
    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (err) {
    console.error('🔥 Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});
