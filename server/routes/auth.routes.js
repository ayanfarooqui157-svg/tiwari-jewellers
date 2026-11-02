import { Router } from 'express';
import { dataStore } from '../data/store.js';
import { generateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const result = dataStore.registerUser({ name, email, password, phone });
    if (!result.success) {
      return res.status(400).json(result);
    }

    const token = generateToken(result.user);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: result.user,
      token
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = dataStore.loginUser(email, password);
    if (!result.success) {
      return res.status(401).json(result);
    }

    const token = generateToken(result.user);
    res.json({
      success: true,
      message: 'Welcome back to Tiwari Jewellers',
      user: result.user,
      token
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', optionalAuth, (req, res, next) => {
  try {
    const email = req.user?.email || req.query?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'User identification required' });
    }

    const user = dataStore.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: dataStore.sanitizeUser(user)
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/profile
router.put('/profile', (req, res, next) => {
  try {
    const { email, name, phone } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const updated = dataStore.updateUserProfile(email, { name, phone });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: updated, message: 'Profile updated successfully' });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/wishlist/toggle
router.post('/wishlist/toggle', (req, res, next) => {
  try {
    const { email, productId } = req.body;
    if (!email || !productId) {
      return res.status(400).json({ success: false, message: 'Email and productId are required' });
    }

    const wishlist = dataStore.toggleWishlist(email, productId);
    if (!wishlist) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/addresses
router.post('/addresses', (req, res, next) => {
  try {
    const { email, address } = req.body;
    if (!email || !address) {
      return res.status(400).json({ success: false, message: 'Email and address details required' });
    }

    const addresses = dataStore.addUserAddress(email, address);
    if (!addresses) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(201).json({ success: true, data: addresses, message: 'Address saved to profile' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/auth/addresses/:id
router.delete('/addresses/:id', (req, res, next) => {
  try {
    const email = req.body?.email || req.query?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required to delete address' });
    }

    const addresses = dataStore.removeUserAddress(email, req.params.id);
    if (!addresses) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: addresses, message: 'Address removed' });
  } catch (error) {
    next(error);
  }
});

export default router;

