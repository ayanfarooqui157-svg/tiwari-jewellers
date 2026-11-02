import { Router } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/products - list all products with optional filters
router.get('/', (req, res, next) => {
  try {
    const products = dataStore.getProducts(req.query);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - single product by id with related recommendations
router.get('/:id', (req, res, next) => {
  try {
    const product = dataStore.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in royal catalog' });
    }

    // Related items from same category
    const related = dataStore.getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 4);

    res.json({
      success: true,
      data: product,
      related
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products/:id/reviews - add a verified customer review
router.post('/:id/reviews', (req, res, next) => {
  try {
    const { author, rating, title, text } = req.body;
    if (!author || !rating || !text) {
      return res.status(400).json({ success: false, message: 'Author, rating and review text are required' });
    }

    const review = dataStore.addReview(req.params.id, { author, rating, title, text });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

export default router;

