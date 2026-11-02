import { Router } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/coupons - list publicly available promo vouchers
router.get('/', (req, res, next) => {
  try {
    const coupons = dataStore.getCoupons();
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
});

// POST /api/coupons/validate
router.post('/validate', (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    const result = dataStore.validateCoupon(code, subtotal);
    if (!result.valid) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true, data: result, ...result });
  } catch (error) {
    next(error);
  }
});

export default router;

