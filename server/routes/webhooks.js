import express from 'express';
import { handleRazorpayWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// A clean, single POST definition for the inbound gateway data stream
router.post('/razorpay', handleRazorpayWebhook);

export default router;