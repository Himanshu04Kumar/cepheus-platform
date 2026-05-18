import express from 'express';
import { createRazorpayOrder } from '../utils/razorpay.js';
import { appendTransactionToSheet } from '../utils/sheets.js';
import { sendBookingConfirmationEmail } from '../utils/email.js';

const router = express.Router();

router.post('/test-booking-fee', async (req, res) => {
  try {
    // 1. Read optional target recipient payload value passed in via body, or fall back to your setup email
    const recipientEmail = req.body.email || 'your-own-login-email@gmail.com'; 
    const mockReceiptId = `receipt_cepheus_${Date.now()}`;
    
    // 2. Invoke the Razorpay infrastructure pipeline
    const orderData = await createRazorpayOrder(199, mockReceiptId);
    const parsedAmount = orderData.amount / 100;
    
    // 3. Map execution results to our tabular sheet array
    const sheetRow = [
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      orderData.id,
      orderData.receipt,
      parsedAmount,
      orderData.currency,
      orderData.status
    ];

    // 4. Fire automated backend logging row to Google Cloud Sheet
    await appendTransactionToSheet(sheetRow);
    
    // 5. Fire automated custom HTML receipt notification email via Resend
    // (Note: In sandbox testing mode, Resend requires this to be your own login account email)
    await sendBookingConfirmationEmail(recipientEmail, orderData.id, parsedAmount);
    
    res.json({
      success: true,
      message: 'Full Cepheus Transaction Cycle executed successfully! (Razorpay, Sheets, Resend Engine Unified)',
      orderId: orderData.id,
      loggedToSheets: true,
      emailDispatchedTo: recipientEmail
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;