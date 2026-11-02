import { Router } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// POST /api/contact - submit appointment / concierge inquiry
router.post('/', (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and inquiry message are mandatory.'
      });
    }

    const inquiry = dataStore.addInquiry({ name, email, phone, subject, message });
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been registered with Tiwari Jewellers concierge salon.',
      ticketId: inquiry.id,
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contact - list all inquiries (for administration)
router.get('/', (req, res, next) => {
  try {
    const inquiries = dataStore.getInquiries();
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/contact/:id/status
router.patch('/:id/status', (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const updated = dataStore.updateInquiryStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Inquiry record not found' });
    }

    res.json({ success: true, data: updated, message: 'Inquiry status updated' });
  } catch (error) {
    next(error);
  }
});

export default router;

