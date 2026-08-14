const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/tradeplatform');
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create Trader
    const trader = new User({
      companyName: 'GlobalTrade Co',
      email: 'trader@test.com',
      password: 'password123',
      role: 'trader',
      country: 'China',
      phone: '+86123456789',
      verified: true,
      rating: 4.8,
      totalDeals: 45
    });
    await trader.save();
    console.log('✅ Trader created: trader@test.com');

    // Create Importer
    const importer = new User({
      companyName: 'ImportMaster Ltd',
      email: 'importer@test.com',
      password: 'password123',
      role: 'importer',
      country: 'USA',
      phone: '+1234567890',
      verified: true,
      rating: 4.5,
      totalDeals: 32
    });
    await importer.save();
    console.log('✅ Importer created: importer@test.com');

    // Create Admin
    const admin = new User({
      companyName: 'TradeConnect Admin',
      email: 'admin@tradeconnect.com',
      password: 'admin123',
      role: 'admin',
      country: 'Global',
      verified: true
    });
    await admin.save();
    console.log('✅ Admin created: admin@tradeconnect.com');

    // Create sample listings
    const listings = [
      {
        traderId: trader._id,
        productName: 'Organic Green Tea',
        category: 'Food & Beverage',
        description: 'Premium organic green tea from Fujian province. High quality, fresh harvest.',
        price: 25.50,
        currency: 'USD',
        minOrderQty: 500,
        origin: 'China',
        certifications: ['Organic', 'ISO 22000'],
        featured: true
      },
      {
        traderId: trader._id,
        productName: 'Stainless Steel Cookware Set',
        category: 'Home & Kitchen',
        description: 'High-quality 18/10 stainless steel cookware set. 7 pieces.',
        price: 89.99,
        currency: 'USD',
        minOrderQty: 100,
        origin: 'China',
        certifications: ['ISO 9001']
      },
      {
        traderId: trader._id,
        productName: 'Smart LED TV 55"',
        category: 'Electronics',
        description: '4K UHD Smart LED TV with built-in streaming apps.',
        price: 399.00,
        currency: 'USD',
        minOrderQty: 50,
        origin: 'South Korea',
        certifications: ['CE', 'FCC']
      }
    ];

    for (const listingData of listings) {
      const listing = new Listing(listingData);
      await listing.save();
      console.log(`✅ Listing created: ${listing.productName}`);
    }

    console.log('\n🎉 SEED COMPLETE!');
    console.log('\n📋 Test Accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Trader:   trader@test.com / password123');
    console.log('👤 Importer: importer@test.com / password123');
    console.log('👤 Admin:    admin@tradeconnect.com / admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🚀 Run: npm run dev');
    console.log('🌐 Visit: http://localhost:3000');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seed();