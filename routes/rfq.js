const express = require('express');
const router = express.Router();
const RFQ = require('../models/RFQ');

router.get('/new', (req, res) => {
  if (!req.session.user || req.session.user.role !== 'importer') {
    return res.redirect('/auth/login');
  }
  res.render('new-rfq', { user: req.session.user, error: null });
});

router.post('/new', async (req, res) => {
  try {
    const { productName, category, quantity, targetPrice, currency, destination, deadline, description } = req.body;
    const rfq = new RFQ({
      importerId: req.session.user.id,
      productName, category,
      quantity: Number(quantity),
      targetPrice: Number(targetPrice),
      currency, destination,
      deadline: new Date(deadline),
      description
    });
    await rfq.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.render('new-rfq', { error: err.message, user: req.session.user });
  }
});

router.get('/', async (req, res) => {
  const rfqs = await RFQ.find({ status: 'open' })
    .populate('importerId', 'companyName country')
    .sort({ createdAt: -1 });
  res.json(rfqs);
});

router.post('/:rfqId/quote', async (req, res) => {
  try {
    if (!req.session.user || req.session.user.role !== 'trader') {
      return res.status(401).json({ error: 'Only traders can quote' });
    }
    const { price, message } = req.body;
    const rfq = await RFQ.findById(req.params.rfqId);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    rfq.quotes.push({ traderId: req.session.user.id, price: Number(price), message });
    rfq.status = 'quoted';
    await rfq.save();
    res.json({ success: true, message: 'Quote submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
