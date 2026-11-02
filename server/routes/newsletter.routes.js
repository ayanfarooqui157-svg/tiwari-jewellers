import { Router } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// POST /api/newsletter/subscribe
router.post('/subscribe', (req, res, next) => {
  try {
    const { email, source } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const result = dataStore.addSubscriber(email, source);
    if (result.alreadySubscribed) {
      return res.json({
        success: true,
        alreadySubscribed: true,
        message: 'You are already an esteemed member of the Tiwari Jewellers Club. Your privilege code is TIWARI10.',
        voucherCode: 'TIWARI10'
      });
    }

    res.status(201).json({
      success: true,
      alreadySubscribed: false,
      message: 'Welcome to Tiwari Jewellers Club. Your 10% welcome privilege code is TIWARI10.',
      voucherCode: 'TIWARI10',
      data: result.subscriber
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/newsletter/subscribers
router.get('/subscribers', (req, res, next) => {
  try {
    const subscribers = dataStore.getSubscribers();
    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    next(error);
  }
});

export default router;

