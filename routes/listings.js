const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

router.get('/new', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'trader') {
    return res.redirect('/auth/login');
  }
  res.render('new-listing', { user: req.session.user, error: null });
});

router.post('/new', async (req, res) => {
  try {
    const { productName, category, description, price, currency, minOrderQty, origin } = req.body;
    const listing = new Listing({
      traderId: req.session.user.id,
      productName, category, description,
      price: Number(price), currency,
      minOrderQty: Number(minOrderQty), origin
    });
    await listing.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.render('new-listing', { error: err.message, user: req.session.user });
  }
});

router.get('/search', async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  const filter = { status: 'active' };
  if (q) filter.productName = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const listings = await Listing.find(filter).populate('traderId', 'companyName rating');
  res.json(listings);
});

module.exports = router;
