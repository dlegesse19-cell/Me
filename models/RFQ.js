const mongoose = require('mongoose');

const RFQSchema = new mongoose.Schema({
  importerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  category: String,
  quantity: Number,
  targetPrice: Number,
  currency: { type: String, default: 'USD' },
  destination: String,
  deadline: Date,
  description: String,
  status: { type: String, enum: ['open', 'quoted', 'closed'], default: 'open' },
  quotes: [{
    traderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    price: Number,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RFQ', RFQSchema);
