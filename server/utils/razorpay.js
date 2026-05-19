import Razorpay from 'razorpay';
import dotenv from 'dotenv';

// Load our secure environment variables from the .env file
dotenv.config();

// Initialize the Razorpay instance with our secure sandbox API credentials
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Creates a standard transaction order with Razorpay including custom metadata notes
 * @param {number} amount - Raw currency amount (in Rupees)
 * @param {string} receiptId - Clean alphanumeric mapping ID link
 * @param {Object} notes - Optional custom metadata payload object for tracking
 * @returns {Promise<Object>} The raw order payload block returned from Razorpay
 */
export const createRazorpayOrder = async (amount, receiptId, notes = {}) => {
  try {
    // Razorpay captures currency strictly in the smallest currency sub-unit (Paise for INR).
    // To process a ₹199 transaction, we must calculate: 199 * 100 = 19900 Paise.
    const options = {
      amount: Math.round(amount * 100), 
      currency: 'INR',
      receipt: receiptId,
      notes: notes // 🚀 This passes our rich metadata payload directly into Razorpay's cloud ledger
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay SDK Order Creation Failure:', error);
    throw new Error(`Razorpay processing failed: ${error.message}`);
  }
};