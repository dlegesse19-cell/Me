const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');
const RFQ = require('../models/RFQ');

const isAdmin = async (req, res, next) => {
  if (!req.session.user) return res.redirect('/auth/login');
  const user = await User.findById(req.session.user.id);
  if (user && user.role === 'admin') return next();
  res.status(403).send('Access denied');
};

router.use(isAdmin);

router.get('/', async (req, res) => {
  const stats = {
    users: await User.countDocuments(),
    importers: await User.countDocuments({ role: 'importer' }),
    traders: await User.countDocuments({ role: 'trader' }),
    listings: await Listing.countDocuments(),
    activeListings: await Listing.countDocuments({ status: 'active' }),
    rfqs: await RFQ.countDocuments(),
    openRfqs: await RFQ.countDocuments({ status: 'open' })
  };
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
  const recentListings = await Listing.find().sort({ createdAt: -1 }).limit(5);
  res.render('admin/dashboard', { stats, recentUsers, recentListings });
});

router.post('/verify/:userId', async (req, res) => {
  await User.findByIdAndUpdate(req.params.userId, { verified: true });
  res.json({ success: true });
});

router.delete('/listing/:listingId', async (req, res) => {
  await Listing.findByIdAndDelete(req.params.listingId);
  res.json({ success: true });
});

module.exports = router;
