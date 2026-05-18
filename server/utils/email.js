import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Resend transactional email transport engine
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Dispatches an automated transactional HTML receipt verification message
 * @param {string} targetEmail - The destination user email address
 * @param {string} orderId - The verified Razorpay transaction link code
 * @param {number} amount - The currency amount paid in INR
 */
export const sendBookingConfirmationEmail = async (targetEmail, orderId, amount) => {
  try {
    const data = await resend.emails.send({
      from: 'Cepheus Platform <onboarding@resend.dev>', // Resend sandbox trial domain
      to: targetEmail,
      subject: '✨ Booking Order Confirmed | Cepheus Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #2563eb; text-align: center;">Transaction Successfully Verified</h2>
          <p>Hello,</p>
          <p>Thank you for choosing the Cepheus Platform. Your processing booking engine sequence has initialized successfully.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #4b5563;"><strong>Order tracking ID:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #1f2937;"><code>${orderId}</code></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4b5563;"><strong>Amount Captured:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #1f2937; font-size: 16px; font-weight: bold;">₹${amount}.00 INR</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #4b5563;"><strong>Gateway System Status:</strong></td>
              <td style="padding: 8px 0; text-align: right; color: #16a34a;"><strong>Success / Settled</strong></td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated administrative notification tracking record dispatched from the Cepheus Core Core Sandbox Engine ecosystem.</p>
        </div>
      `,
    });

    console.log(`📧 [Mailing Engine] Transactional audit confirmation cleanly transmitted: ${data.id}`);
    return data;
  } catch (error) {
    console.error('❌ [Mailing Engine] Outbound email engine transmission failure:', error);
    // Silent mitigation wrapper to protect baseline thread runtime execution
  }
};