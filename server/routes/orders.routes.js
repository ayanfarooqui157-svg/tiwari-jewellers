import { Router } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/orders - list orders (all or filtered by customer email)
router.get('/', (req, res, next) => {
  try {
    const { email } = req.query;
    const orders = dataStore.getOrders(email);
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/track/:trackingNumber - track shipment
router.get('/track/:trackingNumber', (req, res, next) => {
  try {
    const { trackingNumber } = req.params;
    const order = dataStore.getOrderById(trackingNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Tracking record not found' });
    }

    res.json({
      success: true,
      trackingNumber: order.trackingNumber,
      orderId: order.id,
      orderStatus: order.orderStatus,
      courierPartner: 'BlueDart / Sequel Armoured Logistics',
      destination: `${order.shippingAddress?.city}, ${order.shippingAddress?.pincode}`,
      timeline: order.timeline || []
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - get specific order
router.get('/:id', (req, res, next) => {
  try {
    const order = dataStore.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found in vault registry' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// POST /api/orders - place order
router.post('/', (req, res, next) => {
  try {
    const { customer, shippingAddress, items, pricing, paymentMethod, paymentStatus, paymentId } = req.body;
    if (!customer || !shippingAddress || !items || !Array.isArray(items) || items.length === 0 || !pricing) {
      return res.status(400).json({ success: false, message: 'Missing essential order specifications' });
    }

    const newOrder = dataStore.createOrder({
      customer,
      shippingAddress,
      items,
      pricing,
      paymentMethod,
      paymentStatus,
      paymentId
    });

    res.status(201).json({
      success: true,
      message: 'Royal order recorded and dispatched for hallmarking assay',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
});

export default router;

