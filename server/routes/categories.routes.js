import { Router } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/categories - retrieve all categories with live item count
router.get('/', (req, res, next) => {
  try {
    const categories = dataStore.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

export default router;

