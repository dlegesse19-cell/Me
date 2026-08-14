const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tradeplatform');
    console.log('📦 Connected to MongoDB');

    await User.deleteMany({});
    await Listing.deleteMany({});

    const trader = new User({
      companyName: 'GlobalTrade Co',
      email: 'trader@test.com',
      password: 'password123',
      role: 'trader',
      country: 'China',
      verified: true,
      rating: 4.8
    });
    await trader.save();
    console.log('✅ Trader created');

    const importer = new User({
      companyName: 'ImportMaster Ltd',
      email: 'importer@test.com',
      password: 'password123',
      role: 'importer',
      country: 'USA',
      verified: true
    });
    await importer.save();
    console.log('✅ Importer created');

    const admin = new User({
      companyName: 'TradeConnect Admin',
      email: 'admin@tradeconnect.com',
      password: 'admin123',
      role: 'admin',
      country: 'Global',
      verified: true
    });
    await admin.save();
    console.log('✅ Admin created');

    await Listing.create({
      traderId: trader._id,
      productName: 'Organic Green Tea',
      category: 'Food & Beverage',
      description: 'Premium organic green tea',
      price: 25.50,
      currency: 'USD',
      minOrderQty: 500,
      origin: 'China'
    });
    console.log('✅ Listing created');

    console.log('\n🎉 SEED COMPLETE!');
    console.log('Trader: trader@test.com / password123');
    console.log('Importer: importer@test.com / password123');
    console.log('Admin: admin@tradeconnect.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seed();
