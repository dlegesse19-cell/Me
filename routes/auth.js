const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => res.render('register', { error: null }));

router.post('/register', async (req, res) => {
  try {
    const { companyName, email, password, role, country, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.render('register', { error: 'Email already registered' });
    
    const user = new User({ companyName, email, password, role, country, phone });
    await user.save();
    
    req.session.user = { id: user._id, companyName, email, role };
    res.redirect('/dashboard');
  } catch (err) {
    res.render('register', { error: err.message });
  }
});

router.get('/login', (req, res) => res.render('login', { error: null }));

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    req.session.user = { id: user._id, companyName: user.companyName, email, role: user.role };
    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { error: err.message });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
