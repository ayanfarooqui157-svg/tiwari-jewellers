import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config/index.js';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_COUPONS } from '../data/products.js';
import { dataStore } from '../data/store.js';

async function seedAtlas() {
  const uri = config.mongodb.uri;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment or server/.env');
    process.exit(1);
  }

  console.log('🍃 Connecting to MongoDB Atlas...');
  console.log(`🔗 Target: ${uri.replace(/:([^:@]+)@/, ':****@')}`);

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true
    }
  });

  try {
    await client.connect();
    const db = client.db('tiwari_jewellers');
    console.log('✅ Connected to MongoDB Atlas: tiwari_jewellers\n');

    // Collections
    const productsCol = db.collection('products');
    const categoriesCol = db.collection('categories');
    const ordersCol = db.collection('orders');
    const couponsCol = db.collection('coupons');
    const usersCol = db.collection('users');
    const inquiriesCol = db.collection('inquiries');
    const subscribersCol = db.collection('subscribers');

    // Use current store data or initial seed data
    const products = dataStore.products.length > 0 ? dataStore.products : INITIAL_PRODUCTS;
    const categories = dataStore.categories.length > 0 ? dataStore.categories : INITIAL_CATEGORIES;
    const orders = dataStore.orders.length > 0 ? dataStore.orders : INITIAL_ORDERS;
    const coupons = dataStore.coupons.length > 0 ? dataStore.coupons : INITIAL_COUPONS;
    const users = dataStore.users.length > 0 ? dataStore.users : dataStore.getDefaultUsers();
    const inquiries = dataStore.inquiries.length > 0 ? dataStore.inquiries : dataStore.getDefaultInquiries();
    const subscribers = dataStore.subscribers.length > 0 ? dataStore.subscribers : dataStore.getDefaultSubscribers();

    // 1. Seed Products
    await productsCol.deleteMany({});
    await productsCol.insertMany(products.map(({ _id, ...p }) => p));
    console.log(`💎 Seeded ${products.length} Products to 'products' collection`);

    // 2. Seed Categories
    await categoriesCol.deleteMany({});
    await categoriesCol.insertMany(categories.map(({ _id, ...c }) => c));
    console.log(`👑 Seeded ${categories.length} Categories to 'categories' collection`);

    // 3. Seed Orders
    await ordersCol.deleteMany({});
    await ordersCol.insertMany(orders.map(({ _id, ...o }) => o));
    console.log(`📦 Seeded ${orders.length} Orders to 'orders' collection`);

    // 4. Seed Coupons
    await couponsCol.deleteMany({});
    await couponsCol.insertMany(coupons.map(({ _id, ...c }) => c));
    console.log(`🎟️ Seeded ${coupons.length} Promo Vouchers to 'coupons' collection`);

    // 5. Seed Users
    await usersCol.deleteMany({});
    await usersCol.insertMany(users.map(({ _id, ...u }) => u));
    console.log(`👤 Seeded ${users.length} Users & Administrators to 'users' collection`);

    // 6. Seed Inquiries
    await inquiriesCol.deleteMany({});
    await inquiriesCol.insertMany(inquiries.map(({ _id, ...i }) => i));
    console.log(`📨 Seeded ${inquiries.length} VIP Consultation Inquiries to 'inquiries' collection`);

    // 7. Seed Subscribers
    await subscribersCol.deleteMany({});
    await subscribersCol.insertMany(subscribers.map(({ _id, ...s }) => s));
    console.log(`✨ Seeded ${subscribers.length} VIP Club Subscribers to 'subscribers' collection`);

    // Create helpful indexes
    await productsCol.createIndex({ id: 1 }, { unique: true });
    await productsCol.createIndex({ category: 1 });
    await productsCol.createIndex({ name: "text", description: "text" });
    await usersCol.createIndex({ email: 1 }, { unique: true });
    await ordersCol.createIndex({ id: 1 }, { unique: true });
    await ordersCol.createIndex({ trackingNumber: 1 });
    console.log('⚡ Unique & search indexes ensured.');

    console.log('\n🎉 SUCCESS! MongoDB Atlas deployment and seeding complete.');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedAtlas();

