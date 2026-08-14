const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['importer', 'trader', 'admin'], required: true },
  country: String,
  phone: String,
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  totalDeals: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
});

module.exports = mongoose.model('User', UserSchema);
