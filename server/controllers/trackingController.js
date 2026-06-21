import { supabase } from '../config/supabase.js';

/**
 * Resolves a live booking from Supabase, joining its associated diagnostic photos and warranty details.
 * Supports query resolution via direct UUID, payment order suffix, or customer phone number.
 * ROUTE: GET /api/tracking/:id
 */
export const getTrackingRecord = async (req, res) => {
  const { id } = req.params;
  const searchStr = id.trim();

  try {
    let booking = null;

    // Helper function to check if string is a valid Postgres UUID format
    const isValidUuid = (str) => {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    };

    // 1. Direct UUID Lookup
    if (isValidUuid(searchStr)) {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          repair_photos (*),
          warranties (*),
          approval_requests (*)
        `)
        .eq('id', searchStr)
        .single();

      if (!error && data) {
        booking = data;
      }
    }

    // 2. Suffix match or phone search fallback
    if (!booking) {
      const { data: allBookings, error: fetchErr } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:users!bookings_customer_id_fkey (*),
          repair_photos (*),
          warranties (*),
          approval_requests (*)
        `);

      if (fetchErr) throw fetchErr;

      const cleanSearch = searchStr.replace(/^CPH-/i, '').toLowerCase();

      booking = allBookings.find(b => {
        const uuidClean = b.id.replace(/-/g, '').toLowerCase();
        // Check if the search term matches the end of the UUID (e.g. CPH-xxxxxx)
        const matchesSuffix = uuidClean.endsWith(cleanSearch) && cleanSearch.length >= 4;
        const matchesOrder = b.razorpay_order_id && b.razorpay_order_id.toLowerCase() === cleanSearch;
        const matchesPayment = b.razorpay_payment_id && b.razorpay_payment_id.toLowerCase() === cleanSearch;
        const matchesPhone = b.customer && b.customer.phone && b.customer.phone.replace(/\D/g, '').includes(cleanSearch) && cleanSearch.length >= 6;
        
        return matchesSuffix || matchesOrder || matchesPayment || matchesPhone;
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'No active record located under that matching tracking vector.'
      });
    }

    // Determine warranty state
    const activeWarranty = booking.warranties && booking.warranties.length > 0
      ? booking.warranties[0]
      : null;

    // Standardize photo array structure to match frontend expectations
    const formattedPhotos = (booking.repair_photos || []).map(p => ({
      stage: p.stage,
      url: p.photo_url,
      caption: p.caption,
      time: new Date(p.uploaded_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    }));

    // Retrieve active/pending approval requests for the price approval gate
    const activeApproval = booking.approval_requests && booking.approval_requests.length > 0
      ? booking.approval_requests.find(a => a.status === 'pending') || booking.approval_requests[0]
      : null;

    const responseBooking = {
      id: booking.id,
      device_brand: booking.device_brand,
      device_model: booking.device_model,
      status: booking.status,
      issue_description: booking.issue_description,
      repair_type: booking.repair_type,
      final_price: booking.final_price || (activeApproval ? activeApproval.quoted_price : null),
      pickup_address: booking.pickup_address,
      technician_notes: booking.technician_notes || (activeApproval ? activeApproval.diagnosis_description : null),
      photos: formattedPhotos,
      warranty_days: activeWarranty ? activeWarranty.duration_days : null,
      warranty_status: activeWarranty ? activeWarranty.status : null
    };

    return res.status(200).json({
      success: true,
      booking: responseBooking
    });

  } catch (error) {
    console.error('❌ [Tracking Controller Exception]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Fatal exception resolving tracking record.'
    });
  }
};

/**
 * Updates status and processes client gate authorization approval / rejection actions.
 * ROUTE: POST /api/tracking/:id/gate-approval
 */
export const updateGateApproval = async (req, res) => {
  const { id } = req.params;
  const { approved, responseNote } = req.body;

  try {
    // 1. Fetch the latest pending approval request
    const { data: approvalRequests, error: findError } = await supabase
      .from('approval_requests')
      .select('*')
      .eq('booking_id', id)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });

    if (findError) throw findError;

    const targetRequest = approvalRequests && approvalRequests.length > 0 ? approvalRequests[0] : null;

    if (targetRequest) {
      const { error: updateRequestError } = await supabase
        .from('approval_requests')
        .update({
          status: approved ? 'approved' : 'declined',
          customer_response_note: responseNote || (approved ? 'Authorized via tracking node.' : 'Declined via tracking node.'),
          responded_at: new Date().toISOString()
        })
        .eq('id', targetRequest.id);

      if (updateRequestError) throw updateRequestError;
    }

    // 2. Adjust core booking statuses
    const nextStatus = approved ? 'in_repair' : 'cancelled';
    const updateData = {
      status: nextStatus,
      updated_at: new Date().toISOString()
    };

    // If approved, finalize the price based on the authorization quota
    if (approved && targetRequest) {
      updateData.final_price = targetRequest.quoted_price;
    }

    const { error: updateBookingError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id);

    if (updateBookingError) throw updateBookingError;

    return res.status(200).json({
      success: true,
      message: `Booking authorization successfully updated to: ${nextStatus}.`
    });

  } catch (error) {
    console.error('❌ [Gate Approval Exception]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Fatal exception recording gate authorization response.'
    });
  }
};
