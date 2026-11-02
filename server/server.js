import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { requestLogger } from './middleware/logger.js';
import { notFoundHandler, errorHandler } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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

// Custom request logger
app.use(requestLogger);

// ========================
// HEALTH & DIAGNOSTIC ROUTE
// ========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'TIWARI JWELLERS – Haute Joaillerie',
    tagline: 'Ancestral Royalty, Contemporary Mastery',
    environment: config.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// ========================
// API ROUTES MOUNTING
// ========================
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

// Fallback & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n💎 ========================================================`);
  console.log(`✨ TIWARI JWELLERS Luxury Backend Online`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
  console.log(`🛡️ Mode: ${config.nodeEnv}`);
  console.log(`💎 ========================================================\n`);
});

export default app;
