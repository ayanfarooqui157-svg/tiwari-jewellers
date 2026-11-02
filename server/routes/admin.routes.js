import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dataStore } from '../data/store.js';
import { requireAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
    cb(null, `tj-${Date.now()}-${cleanName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are permitted.'));
    }
  }
});

const router = Router();

// Apply requireAdmin guard to all administrative routes
router.use(requireAdmin);

// POST /api/admin/upload - upload product photograph
router.post('/upload', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Photograph uploaded successfully to boutique storage',
      url: fileUrl,
      filename: req.file.filename
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/stats - full executive business intelligence
router.get('/stats', (req, res, next) => {
  try {
    const stats = dataStore.getAdminStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products - create new product
router.post('/products', (req, res, next) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Product title and price are mandatory' });
    }

    const product = dataStore.addProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product minted into catalog registry',
      data: product
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - update product
router.put('/products/:id', (req, res, next) => {
  try {
    const updated = dataStore.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found in registry' });
    }

    res.json({
      success: true,
      message: 'Product details updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id - delete product
router.delete('/products/:id', (req, res, next) => {
  try {
    const deleted = dataStore.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Jewellery piece decommissioned from live boutique'
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/orders/:id/status - update order dispatch & vault status
router.patch('/orders/:id/status', (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'New order status required' });
    }

    const order = dataStore.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order record not found' });
    }

    res.json({
      success: true,
      message: `Order status transitioned to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/inquiries - list customer consultation requests
router.get('/inquiries', (req, res, next) => {
  try {
    const inquiries = dataStore.getInquiries();
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/subscribers - list newsletter club subscribers
router.get('/subscribers', (req, res, next) => {
  try {
    const subscribers = dataStore.getSubscribers();
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    next(error);
  }
});

export default router;
