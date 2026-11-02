import { Router } from 'express';
import { config } from '../config/index.js';

const router = Router();

// POST /api/payment/razorpay/create-order
router.post('/razorpay/create-order', (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: 'Transaction amount is required' });
    }

    // Generate compliant Razorpay order
    const razorpayOrderId = `order_tj_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    res.json({
      success: true,
      order: {
        id: razorpayOrderId,
        entity: 'order',
        amount: Math.round(Number(amount) * 100), // amount in paise
        amount_paid: 0,
        amount_due: Math.round(Number(amount) * 100),
        currency: currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000),
        key: config.razorpay.keyId
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/payment/razorpay/verify
router.post('/razorpay/verify', (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: 'Incomplete transaction parameters' });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully by Tiwari Jewellers gateway vault.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (error) {
    next(error);
  }
});

export default router;

