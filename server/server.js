
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { config } from './config/index.js';
import { connectDB, isConnected } from './database/connection.js';
import { dataStore } from './data/store.js';

import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

// Route handlers
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import couponsRoutes from './routes/coupons.routes.js';
import contactRoutes from './routes/contact.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import adminRoutes from './routes/admin.routes.js';

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = config.port;

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-email']
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(uploadsDir));

// Request logger
app.use(requestLogger);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'TIWARI JWELLERS – Haute Joaillerie',
    tagline: 'Ancestral Royalty, Contemporary Mastery',
    environment: config.nodeEnv,
    database: isConnected() ? 'MongoDB Atlas (Connected)' : 'Local Vault Store (Offline Fallback)',
    dataSource: isConnected() ? 'mongodb_atlas' : 'local_json',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);

// Fallback and error handling
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    if (config.mongodb.uri) {
      await connectDB();
      await dataStore.syncWithMongo();
    }

    app.listen(PORT, () => {
      console.log('\n💎 ========================================');
      console.log('✨ TIWARI JWELLERS Luxury Backend Online');
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
      console.log(`🛡️ Mode: ${config.nodeEnv}`);
      console.log('💎 ========================================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exitCode = 1;
  }
}

startServer();

export default app;
