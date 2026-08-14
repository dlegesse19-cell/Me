const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  traderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  minOrderQty: Number,
  origin: String,
  certifications: [String],
  images: [String],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);
