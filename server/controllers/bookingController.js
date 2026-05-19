import { supabase } from '../config/supabase.js'; // Ensure your Supabase client configuration path is correct
import { createRazorpayOrder } from '../utils/razorpay.js';
import { appendTransactionToSheet } from '../utils/sheets.js';
import { sendBookingConfirmationEmail } from '../utils/email.js';

/**
 * Orchestrates user ingestion, dynamic Razorpay generation with metadata notes, and third-party accounting logs
 * ROUTE: POST /api/bookings/initialize
 */
export const initializeBookingWorkflow = async (req, res) => {
  try {
    // 1. Extract complete diagnostic and profile data from the inbound request body
    const { 
      email, 
      name, 
      phone, 
      amount,
      deviceBrand, 
      deviceModel, 
      issueDescription, 
      repairType, 
      pickupAddress, 
      pickupZone, 
      pickupDate, 
      pickupSlot 
    } = req.body;

    // Core input parameter validation guard
    if (!email || !name || !amount || !deviceBrand || !deviceModel) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing vital request parameters: email, name, amount, deviceBrand, and deviceModel are mandatory.' 
      });
    }

    // 2. Query Supabase to find an existing user profile or register a new one
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 indicates 0 rows found safely
      throw new Error(`Supabase User Query Exception: ${userError.message}`);
    }

    // If the user profile doesn't exist, execute an atomic insert sequence
    if (!user) {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email, full_name: name, phone }])
        .select('id')
        .single();

      if (insertError) throw new Error(`Supabase User Provisioning Failure: ${insertError.message}`);
      user = newUser;
      console.log(`👤 [Supabase Engine] Successfully provisioned a new user profile link ID: ${user.id}`);
    } else {
      console.log(`👤 [Supabase Engine] Existing user record resolved smoothly for ID: ${user.id}`);
    }
    
    // 3. Package dynamic data into a metadata packet for Razorpay's internal notes tracking
    const orderReceiptHash = `rcpt_cepheus_${Date.now()}`;
    const metadataNotes = {
      customerId: user.id, // Dynamically links the provisioned Postgres UUID!
      deviceBrand: deviceBrand,
      deviceModel: deviceModel,
      issueDescription: issueDescription || "Standard Diagnostic",
      repairType: repairType || "General Assessment",
      pickupAddress: pickupAddress || "Provided on call",
      pickupZone: pickupZone || "Delhi Central",
      pickupDate: pickupDate || new Date().toISOString().split('T')[0],
      pickupSlot: pickupSlot || "Flexible Hours"
    };

    // Invoke the Razorpay sandbox pipeline passing both amount/receipt and our metadata payload
    // Note: We update our utility function call to consume this third parameter cleanly
    const razorpayOrder = await createRazorpayOrder(amount, orderReceiptHash, metadataNotes);

    // 4. Map operational variables straight to your automated Google Sheet layout matrix
    const standardIndianTimestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const databaseSheetRow = [
      standardIndianTimestamp,
      razorpayOrder.id,
      razorpayOrder.receipt,
      amount,
      razorpayOrder.currency,
      'pending_payment_verification' // Set status explicitly until webhook checks clear it
    ];
    await appendTransactionToSheet(databaseSheetRow);

    // 5. Fire automated custom HTML receipt notification email via Resend
    await sendBookingConfirmationEmail(email, razorpayOrder.id, amount);

    // 6. Return unified payload data variables back to the client interface
    return res.status(200).json({
      success: true,
      message: 'Booking sequence initialized across database, payment gateway, and tracking ledgers with attached metadata.',
      userId: user.id,
      orderId: razorpayOrder.id,
      amountInPaise: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt
    });

  } catch (error) {
    console.error('❌ [Booking Controller Exception] Global runtime break:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Fatal operational breakpoint inside the booking workflow execution engine.' 
    });
  }
};