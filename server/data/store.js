import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_ORDERS, INITIAL_COUPONS } from './products.js';
import { connectDB, isConnected, getCollection } from '../database/connection.js';
import { config } from '../config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE_PATH = process.env.TIWARI_DATA_FILE
  ? path.resolve(process.env.TIWARI_DATA_FILE)
  : path.join(__dirname, 'db.json');

class DataStore {
  constructor() {
    this.products = [];
    this.categories = [];
    this.orders = [];
    this.coupons = [];
    this.users = [];
    this.inquiries = [];
    this.subscribers = [];
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        this.products = parsed.products || [...INITIAL_PRODUCTS];
        this.categories = parsed.categories || [...INITIAL_CATEGORIES];
        this.orders = parsed.orders || [...INITIAL_ORDERS];
        this.coupons = parsed.coupons || [...INITIAL_COUPONS];
        this.users = parsed.users || this.getDefaultUsers();
        this.inquiries = parsed.inquiries || this.getDefaultInquiries();
        this.subscribers = parsed.subscribers || this.getDefaultSubscribers();
        this.ensureAdminUser();
        console.log(`📦 Loaded local database with ${this.products.length} products, ${this.orders.length} orders, and ${this.users.length} users.`);
        return;
      } catch (err) {
        console.warn('⚠️ Error parsing db.json, re-initializing from seeds:', err.message);
      }
    }

    // Initialize from seeds
    this.products = [...INITIAL_PRODUCTS];
    this.categories = [...INITIAL_CATEGORIES];
    this.orders = [...INITIAL_ORDERS];
    this.coupons = [...INITIAL_COUPONS];
    this.users = this.getDefaultUsers();
    this.inquiries = this.getDefaultInquiries();
    this.subscribers = this.getDefaultSubscribers();
    this.saveToFile();
    console.log(`✨ Initialized new persistent store at ${DB_FILE_PATH}`);
  }

  async syncWithMongo() {
    try {
      const db = await connectDB();
      if (!db) return;

      const productsCol = getCollection('products');
      const categoriesCol = getCollection('categories');
      const ordersCol = getCollection('orders');
      const couponsCol = getCollection('coupons');
      const usersCol = getCollection('users');
      const inquiriesCol = getCollection('inquiries');
      const subscribersCol = getCollection('subscribers');

      if (!productsCol) return;

      const count = await productsCol.countDocuments();
      if (count === 0) {
        console.log('🍃 MongoDB Atlas boutique database is empty. Seeding collections...');
        if (this.products.length > 0) await productsCol.insertMany(this.products.map(p => ({ ...p })));
        if (this.categories.length > 0) await categoriesCol.insertMany(this.categories.map(c => ({ ...c })));
        if (this.orders.length > 0) await ordersCol.insertMany(this.orders.map(o => ({ ...o })));
        if (this.coupons.length > 0) await couponsCol.insertMany(this.coupons.map(c => ({ ...c })));
        if (this.users.length > 0) await usersCol.insertMany(this.users.map(u => ({ ...u })));
        if (this.inquiries.length > 0) await inquiriesCol.insertMany(this.inquiries.map(i => ({ ...i })));
        if (this.subscribers.length > 0) await subscribersCol.insertMany(this.subscribers.map(s => ({ ...s })));
        console.log('✨ Seeded all collections to MongoDB Atlas successfully!');
      } else {
        // Hydrate from MongoDB Atlas
        const [mProducts, mCategories, mOrders, mCoupons, mUsers, mInquiries, mSubscribers] = await Promise.all([
          productsCol.find().toArray(),
          categoriesCol.find().toArray(),
          ordersCol.find().toArray(),
          couponsCol.find().toArray(),
          usersCol.find().toArray(),
          inquiriesCol.find().toArray(),
          subscribersCol.find().toArray()
        ]);

        if (mProducts.length > 0) this.products = mProducts.map(({ _id, ...p }) => p);
        if (mCategories.length > 0) this.categories = mCategories.map(({ _id, ...c }) => c);
        if (mOrders.length > 0) this.orders = mOrders.map(({ _id, ...o }) => o);
        if (mCoupons.length > 0) this.coupons = mCoupons.map(({ _id, ...c }) => c);
        if (mUsers.length > 0) this.users = mUsers.map(({ _id, ...u }) => u);
        if (mInquiries.length > 0) this.inquiries = mInquiries.map(({ _id, ...i }) => i);
        if (mSubscribers.length > 0) this.subscribers = mSubscribers.map(({ _id, ...s }) => s);

        this.ensureAdminUser();
        this.saveToFile();
        console.log(`📦 Synchronized ${this.products.length} products, ${this.orders.length} orders, and ${this.users.length} users with MongoDB Atlas.`);
      }
    } catch (err) {
      console.warn('⚠️ MongoDB Atlas sync notice:', err.message);
    }
  }

  async persistToMongo(collectionName, doc, idField = 'id') {
    if (!isConnected()) return;
    try {
      const col = getCollection(collectionName);
      if (!col || !doc || !doc[idField]) return;
      const { _id, ...cleanDoc } = doc;
      await col.updateOne(
        { [idField]: doc[idField] },
        { $set: cleanDoc },
        { upsert: true }
      );
    } catch (err) {
      console.warn(`MongoDB Atlas write notice (${collectionName}):`, err.message);
    }
  }

  async removeFromMongo(collectionName, id, idField = 'id') {
    if (!isConnected()) return;
    try {
      const col = getCollection(collectionName);
      if (!col) return;
      await col.deleteOne({ [idField]: id });
    } catch (err) {
      console.warn(`MongoDB Atlas delete notice (${collectionName}):`, err.message);
    }
  }

  getDefaultUsers() {
    const adminEmail = (config.admin?.email || "admin@tiwarijewellers.com").toLowerCase().trim();
    const adminPassword = config.admin?.password || "RoyalTiwari@Admin2026";
    const adminName = config.admin?.name || "Vikram Tiwari (Director)";
    return [
      {
        id: "usr-admin",
        name: adminName,
        email: adminEmail,
        passwordHash: bcrypt.hashSync(adminPassword, 10),
        role: "admin",
        phone: "+91 99887 76655",
        addresses: [],
        wishlist: [],
        createdAt: "2026-09-01T10:00:00Z"
      }
    ];
  }

  ensureAdminUser() {
    const adminEmail = (config.admin?.email || 'admin@tiwarijewellers.com').toLowerCase().trim();
    const adminPassword = config.admin?.password || 'RoyalTiwari@Admin2026';
    const adminName = config.admin?.name || 'Vikram Tiwari (Director)';

    // Remove any demo customer Priya Sharma from users list and MongoDB
    this.users = (this.users || []).filter(u => u.email !== 'priya@example.com' && u.id !== 'usr-01');
    this.removeFromMongo('users', 'usr-01', 'id');
    this.removeFromMongo('users', 'priya@example.com', 'email');

    // Remove any demo orders for Priya Sharma
    this.orders = (this.orders || []).filter(o => o.customer?.email !== 'priya@example.com' && o.id !== 'TJ-ORD-8821');
    this.removeFromMongo('orders', 'TJ-ORD-8821', 'id');

    let admin = this.users.find(u => u.role === 'admin' || (u.email && u.email.toLowerCase() === adminEmail));
    if (!admin) {
      admin = {
        id: "usr-admin",
        name: adminName,
        email: adminEmail,
        passwordHash: bcrypt.hashSync(adminPassword, 10),
        role: "admin",
        phone: "+91 99887 76655",
        addresses: [],
        wishlist: [],
        createdAt: new Date().toISOString()
      };
      this.users.push(admin);
    } else {
      admin.name = adminName;
      admin.email = adminEmail;
      admin.role = 'admin';
      if (adminPassword) {
        admin.passwordHash = bcrypt.hashSync(adminPassword, 10);
      }
    }

    this.saveToFile();
    this.persistToMongo('users', admin);
  }

  getDefaultInquiries() {
    return [
      {
        id: "TJ-INQ-1001",
        name: "Ananya Deshmukh",
        email: "ananya.d@example.com",
        phone: "+91 98200 44556",
        subject: "Bespoke Bridal Jewellery Consultation",
        message: "Looking for a customised 22K polki bridal choker and matching mathapatti for my upcoming wedding in December.",
        status: "pending",
        createdAt: "2026-10-31T09:30:00Z"
      },
      {
        id: "TJ-INQ-1002",
        name: "Rohit Singhal",
        email: "rohit.s@example.com",
        phone: "+91 99112 33445",
        subject: "Solitaire Diamond & Ring Sizing Inquiry",
        message: "Need guidance on 1.5 carat round brilliant VVS1 solitaire diamond ring sizing (Size 14) and insured express delivery to Delhi.",
        status: "contacted",
        createdAt: "2026-10-29T14:15:00Z"
      }
    ];
  }

  getDefaultSubscribers() {
    return [
      {
        id: "sub-01",
        email: "vip.patron@tiwarijewellers.com",
        subscribedAt: "2026-10-15T11:20:00Z",
        source: "footer-modal",
        voucherClaimed: true
      },
      {
        id: "sub-02",
        email: "patron.luxury@example.com",
        subscribedAt: "2026-10-25T16:45:00Z",
        source: "hero-club",
        voucherClaimed: false
      }
    ];
  }

  saveToFile() {
    try {
      const data = {
        products: this.products,
        categories: this.categories,
        orders: this.orders,
        coupons: this.coupons,
        users: this.users,
        inquiries: this.inquiries,
        subscribers: this.subscribers,
        updatedAt: new Date().toISOString()
      };
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Failed to persist database to file:', err);
    }
  }

  // ========================
  // PRODUCTS
  // ========================
  getProducts({ category, material, metal, minPrice, maxPrice, search, sort, badge, inStock } = {}) {
    let result = [...this.products];

    if (search) {
      const q = search.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      if (catLower === 'silver') {
        result = result.filter(p => p.material && p.material.toLowerCase() === 'silver');
      } else if (catLower === 'gold') {
        result = result.filter(p => 
          (p.material && p.material.toLowerCase() === 'gold') || 
          (p.metal && p.metal.toLowerCase().includes('gold'))
        );
      } else {
        result = result.filter(p => p.category && p.category.toLowerCase() === catLower);
      }
    }

    if (material && material !== 'all') {
      result = result.filter(p => p.material && p.material.toLowerCase() === material.toLowerCase());
    }

    if (metal && metal !== 'all') {
      result = result.filter(p => p.metal && p.metal.toLowerCase().includes(metal.toLowerCase()));
    }

    if (badge && badge !== 'all') {
      result = result.filter(p => p.badge && p.badge.toLowerCase() === badge.toLowerCase());
    }

    if (inStock === 'true' || inStock === true) {
      result = result.filter(p => p.inStock && p.stockQuantity > 0);
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!isNaN(min)) result = result.filter(p => p.price >= min);
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) result = result.filter(p => p.price <= max);
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating-desc':
        case 'rating':
          result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'bestseller':
        case 'bestselling':
          result.sort((a, b) => (b.badge === 'Bestseller' ? 1 : 0) - (a.badge === 'Bestseller' ? 1 : 0));
          break;
        default:
          break;
      }
    }

    return result;
  }

  getProductById(id) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    return this.products.find(p => p.id && p.id.toLowerCase() === cleanId);
  }

  addProduct(productData) {
    const newId = `tj-${Date.now().toString().slice(-4)}`;
    const categoryCode = (productData.category || 'JEW').slice(0, 3).toUpperCase();
    const sku = productData.sku || `TJ-${categoryCode}-${Math.floor(10 + Math.random() * 90)}`;

    const defaultSizesByCategory = {
      Rings: ["10", "12", "14", "16", "18"],
      Bangles: ["2.4", "2.6", "2.8"],
      Necklaces: ["Adjustable Dori", "16-18 inch"],
      Bracelets: ["6.5 inch", "7 inch", "7.5 inch"],
      Earrings: ["Standard"],
      Pendants: ["Standard"]
    };

    const newProduct = {
      id: newId,
      sku,
      name: productData.name,
      category: productData.category || "Rings",
      metal: productData.metal || "18K Yellow Gold",
      material: productData.material || "Diamond",
      purity: productData.purity || "18K (750)",
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price),
      discount: Number(productData.discount || 0),
      rating: 5.0,
      reviewCount: 0,
      badge: productData.badge || "New Arrival",
      isNew: true,
      inStock: Number(productData.stockQuantity || 10) > 0,
      stockQuantity: Number(productData.stockQuantity || 10),
      images: Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : [productData.images || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"],
      description: productData.description || "Artisanal fine jewellery crafted with BIS certified authenticity.",
      specifications: {
        grossWeight: productData.grossWeight || "3.50 g",
        netGoldWeight: productData.netGoldWeight || "3.20 g",
        purity: productData.purity || "18K BIS 750",
        diamondWeight: productData.diamondWeight || "0.50 ct",
        diamondClarity: productData.diamondClarity || "VVS1 - E/F Colour",
        certification: "100% BIS Hallmarked & IGI Certified",
        dimensions: productData.dimensions || "Standard Boutique Specifications"
      },
      availableSizes: productData.availableSizes || defaultSizesByCategory[productData.category] || ["Standard"],
      careInstructions: "Store in exclusive Tiwari Jewellers royal velvet pouch. Avoid exposure to water, fragrances or domestic chemicals.",
      reviews: []
    };

    this.products.unshift(newProduct);
    this.saveToFile();
    this.persistToMongo('products', newProduct);
    return newProduct;
  }

  updateProduct(id, updates) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const current = this.products[idx];
    const updated = {
      ...current,
      ...updates,
      specifications: {
        ...current.specifications,
        ...(updates.specifications || {}),
        grossWeight: updates.grossWeight || updates.specifications?.grossWeight || current.specifications?.grossWeight,
        diamondWeight: updates.diamondWeight || updates.specifications?.diamondWeight || current.specifications?.diamondWeight
      }
    };

    if (updates.price !== undefined) updated.price = Number(updates.price);
    if (updates.originalPrice !== undefined) updated.originalPrice = Number(updates.originalPrice);
    if (updates.discount !== undefined) updated.discount = Number(updates.discount);

    if (updates.stockQuantity !== undefined) {
      updated.stockQuantity = Number(updates.stockQuantity);
      updated.inStock = updated.stockQuantity > 0;
    }

    if (updates.images && Array.isArray(updates.images)) {
      updated.images = updates.images;
    } else if (updates.images) {
      updated.images = [updates.images];
    }

    this.products[idx] = updated;
    this.saveToFile();
    this.persistToMongo('products', updated);
    return updated;
  }

  deleteProduct(id) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    this.saveToFile();
    this.removeFromMongo('products', id);
    return true;
  }

  addReview(productId, { author, rating, title, text }) {
    const prod = this.getProductById(productId);
    if (!prod) return null;

    const newReview = {
      id: `rev-${Date.now()}`,
      author: author || "Valued Patron",
      rating: Number(rating) || 5,
      date: new Date().toISOString().split('T')[0],
      title: title || "Splendid Craftsmanship",
      text,
      verifiedBuyer: true
    };

    if (!prod.reviews) prod.reviews = [];
    prod.reviews.unshift(newReview);
    prod.reviewCount = prod.reviews.length;
    
    // Recalculate average rating
    const sumRatings = prod.reviews.reduce((acc, r) => acc + r.rating, 0);
    prod.rating = Number((sumRatings / prod.reviews.length).toFixed(1));

    this.saveToFile();
    this.persistToMongo('products', prod);
    return newReview;
  }

  // ========================
  // CATEGORIES
  // ========================
  getCategories() {
    return this.categories.map(cat => {
      const count = this.products.filter(p => {
        if (cat.slug === 'silver') return p.material && p.material.toLowerCase() === 'silver';
        if (cat.slug === 'gold') return (p.material && p.material.toLowerCase() === 'gold') || (p.metal && p.metal.toLowerCase().includes('gold'));
        return p.category && p.category.toLowerCase() === cat.name.toLowerCase();
      }).length;
      return { ...cat, itemCount: count };
    });
  }

  // ========================
  // ORDERS
  // ========================
  getOrders(userEmail = null) {
    if (userEmail) {
      const cleanEmail = userEmail.trim().toLowerCase();
      return this.orders.filter(o => o.customer && o.customer.email && o.customer.email.toLowerCase() === cleanEmail);
    }
    return this.orders;
  }

  getOrderById(id) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    return this.orders.find(o => 
      (o.id && o.id.toLowerCase() === cleanId) || 
      (o.trackingNumber && o.trackingNumber.toLowerCase() === cleanId)
    );
  }

  createOrder(orderData) {
    const orderId = `TJ-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `TJ-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newOrder = {
      id: orderId,
      customer: orderData.customer,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      pricing: orderData.pricing,
      paymentMethod: orderData.paymentMethod || "Cash on Delivery (COD)",
      paymentStatus: orderData.paymentStatus || "Pending (Pay on Delivery)",
      paymentId: orderData.paymentId || null,
      giftPackaging: !!orderData.giftPackaging,
      orderStatus: "Processing",
      trackingNumber,
      timeline: [
        { status: "Order Placed", date: new Date().toISOString(), completed: true, note: "Order placed and scheduled for insured dispatch." },
        { status: "Quality Assaying", date: null, completed: false, note: "BIS Hallmark verification and laser inscription assay." },
        { status: "Secure Vault Packing", date: null, completed: false, note: "Tamper-evident luxury presentation packaging." },
        { status: "Insured Transit", date: null, completed: false, note: "High-value armoured courier dispatch." },
        { status: "Delivered", date: null, completed: false, note: "OTP verified royal handover." }
      ],
      createdAt: new Date().toISOString()
    };

    // Deduct stock safely
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const prod = this.getProductById(item.id);
        if (prod) {
          prod.stockQuantity = Math.max(0, (prod.stockQuantity || 10) - (item.quantity || 1));
          if (prod.stockQuantity === 0) prod.inStock = false;
          this.persistToMongo('products', prod);
        }
      });
    }

    this.orders.unshift(newOrder);
    this.saveToFile();
    this.persistToMongo('orders', newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;
    order.orderStatus = status;

    if (!order.timeline) {
      order.timeline = [
        { status: "Order Placed", date: order.createdAt, completed: true, note: "Order placed." }
      ];
    }

    const statusOrder = [
      'order placed',
      'quality assaying',
      'secure vault packing',
      'insured transit',
      'shipped',
      'delivered'
    ];

    const currentStatusIdx = statusOrder.findIndex(s => 
      status.toLowerCase().includes(s) || s.includes(status.toLowerCase())
    );

    order.timeline.forEach(step => {
      const stepIdx = statusOrder.findIndex(s => 
        step.status.toLowerCase().includes(s) || s.includes(step.status.toLowerCase())
      );
      if (stepIdx !== -1 && currentStatusIdx !== -1 && stepIdx <= currentStatusIdx) {
        step.completed = true;
        if (!step.date) step.date = new Date().toISOString();
      }
    });

    // Update or add specific step
    const step = order.timeline.find(t => t.status.toLowerCase().includes(status.toLowerCase()));
    if (step) {
      step.completed = true;
      step.date = new Date().toISOString();
    } else {
      order.timeline.push({
        status: status,
        date: new Date().toISOString(),
        completed: true,
        note: `Status updated to ${status}`
      });
    }

    this.saveToFile();
    this.persistToMongo('orders', order);
    return order;
  }

  // ========================
  // COUPONS
  // ========================
  getCoupons() {
    return this.coupons;
  }

  validateCoupon(code, subtotal = 0) {
    if (!code) return { valid: false, message: "Please provide a promo voucher code." };
    const coupon = this.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, message: "Invalid promo code. Try TIWARI10, FESTIVE15, or SPARKLE500." };
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return { 
        valid: false, 
        message: `This privilege voucher requires a minimum purchase of ₹${coupon.minOrder.toLocaleString('en-IN')}` 
      };
    }

    let discountAmount = 0;
    if (coupon.discountPercent) {
      discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.flatDiscount) {
      discountAmount = coupon.flatDiscount;
    }

    return {
      valid: true,
      code: coupon.code,
      discountAmount,
      discountPercent: coupon.discountPercent || null,
      flatDiscount: coupon.flatDiscount || null,
      minOrder: coupon.minOrder || 0,
      maxDiscount: coupon.maxDiscount || null,
      description: coupon.description
    };
  }

  // ========================
  // USERS & AUTH
  // ========================
  findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    return this.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
  }

  findUserById(id) {
    if (!id) return null;
    return this.users.find(u => u.id === id);
  }

  registerUser({ name, email, password, phone }) {
    const cleanEmail = email.toLowerCase().trim();
    if (this.findUserByEmail(cleanEmail)) {
      return { success: false, message: "An account with this email already exists." };
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      passwordHash,
      role: "customer",
      phone: phone || "",
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveToFile();
    this.persistToMongo('users', newUser);
    return { success: true, user: this.sanitizeUser(newUser) };
  }

  loginUser(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    const user = this.findUserByEmail(cleanEmail);
    if (!user) {
      return { success: false, message: "Invalid email or password." };
    }

    // Support both bcrypt passwordHash and legacy plain password
    let isValid = false;
    if (user.passwordHash) {
      isValid = bcrypt.compareSync(password, user.passwordHash);
    } else if (user.password) {
      isValid = user.password === password;
      if (isValid) {
        // Upgrade to hashed password
        user.passwordHash = bcrypt.hashSync(password, 10);
        delete user.password;
        this.saveToFile();
        this.persistToMongo('users', user);
      }
    }

    if (!isValid) {
      return { success: false, message: "Invalid email or password." };
    }

    return { success: true, user: this.sanitizeUser(user) };
  }

  updateUserProfile(email, { name, phone }) {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    this.saveToFile();
    this.persistToMongo('users', user);
    return this.sanitizeUser(user);
  }

  addUserAddress(email, addressData) {
    const user = this.findUserByEmail(email);
    if (!user) return null;

    if (!user.addresses) user.addresses = [];
    
    // If marked default, unset other defaults
    if (addressData.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    const newAddr = {
      id: `addr-${Date.now()}`,
      fullName: addressData.fullName || user.name,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      pincode: addressData.pincode,
      phone: addressData.phone || user.phone,
      isDefault: user.addresses.length === 0 ? true : !!addressData.isDefault
    };

    user.addresses.push(newAddr);
    this.saveToFile();
    this.persistToMongo('users', user);
    return user.addresses;
  }

  removeUserAddress(email, addressId) {
    const user = this.findUserByEmail(email);
    if (!user || !user.addresses) return null;
    user.addresses = user.addresses.filter(a => a.id !== addressId);
    this.saveToFile();
    this.persistToMongo('users', user);
    return user.addresses;
  }

  toggleWishlist(userEmail, productId) {
    const user = this.findUserByEmail(userEmail);
    if (!user) return null;

    if (!user.wishlist) user.wishlist = [];
    const idx = user.wishlist.indexOf(productId);
    if (idx > -1) {
      user.wishlist.splice(idx, 1);
    } else {
      user.wishlist.push(productId);
    }
    this.saveToFile();
    this.persistToMongo('users', user);
    return user.wishlist;
  }

  sanitizeUser(user) {
    const { password, passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // ========================
  // CONTACT & INQUIRIES
  // ========================
  addInquiry({ name, email, phone, subject, message }) {
    const newInquiry = {
      id: `TJ-INQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      subject: subject || "Bespoke Jewellery Consultation",
      message,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    this.inquiries.unshift(newInquiry);
    this.saveToFile();
    this.persistToMongo('inquiries', newInquiry);
    return newInquiry;
  }

  getInquiries() {
    return this.inquiries;
  }

  updateInquiryStatus(id, status) {
    const inq = this.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    this.saveToFile();
    this.persistToMongo('inquiries', inq);
    return inq;
  }

  // ========================
  // NEWSLETTER SUBSCRIBERS
  // ========================
  addSubscriber(email, source = "footer") {
    const normalized = email.toLowerCase().trim();
    const existing = this.subscribers.find(s => s.email.toLowerCase() === normalized);
    if (existing) {
      return { alreadySubscribed: true, subscriber: existing };
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      email: normalized,
      subscribedAt: new Date().toISOString(),
      source,
      voucherClaimed: true
    };

    this.subscribers.unshift(newSub);
    this.saveToFile();
    this.persistToMongo('subscribers', newSub);
    return { alreadySubscribed: false, subscriber: newSub };
  }

  getSubscribers() {
    return this.subscribers;
  }

  // ========================
  // ADMIN ANALYTICS
  // ========================
  getAdminStats() {
    const totalSales = this.orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);
    const totalOrders = this.orders.length;
    const totalCustomers = this.users.filter(u => u.role !== 'admin').length;
    const totalProducts = this.products.length;
    const lowStockCount = this.products.filter(p => p.stockQuantity < 5).length;
    const pendingInquiriesCount = this.inquiries.filter(i => i.status === 'pending').length;
    const totalSubscribers = this.subscribers.length;

    // Category breakdown
    const categoryStats = {};
    this.products.forEach(p => {
      categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
    });

    return {
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      pendingInquiriesCount,
      totalSubscribers,
      categoryStats,
      recentOrders: this.orders.slice(0, 5),
      recentInquiries: this.inquiries.slice(0, 5)
    };
  }
}

export const dataStore = new DataStore();
