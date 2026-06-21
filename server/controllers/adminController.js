import { supabase } from '../config/supabase.js';
import sharp from 'sharp';

/**
 * Updates a booking's status in the database.
 * ROUTE: PATCH /api/admin/bookings/:id/status
 */
export const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully.',
      booking: data
    });
  } catch (error) {
    console.error('❌ [Admin Update Status Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update booking status.'
    });
  }
};

/**
 * Uploads a diagnostic image, compresses it to WebP format, saves it to Supabase storage,
 * and links it in the repair_photos table.
 * ROUTE: POST /api/admin/bookings/:id/upload-photo
 */
export const uploadDiagnosticPhoto = async (req, res) => {
  const { id } = req.params;
  const { stage, caption } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded.' });
  }

  try {
    // 1. Process image buffer to WebP via sharp
    const webpBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();

    const fileName = `${id}/${stage || 'diagnosis'}_${Date.now()}.webp`;

    // 2. Ensure bucket exists
    try {
      await supabase.storage.createBucket('repair-photos', { public: true });
    } catch (bucketErr) {
      // Ignore if it already exists
    }

    // 3. Upload to Supabase Storage
    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('repair-photos')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (uploadErr) throw uploadErr;

    // 4. Retrieve public URL
    const { data: publicUrlData } = supabase.storage
      .from('repair-photos')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 5. Insert audit log into repair_photos table
    const { data: photoData, error: photoErr } = await supabase
      .from('repair_photos')
      .insert([
        {
          booking_id: id,
          stage: stage || 'diagnosis',
          photo_url: publicUrl,
          caption: caption || 'Diagnostic photo uploaded by technician'
        }
      ])
      .select()
      .single();

    if (photoErr) throw photoErr;

    return res.status(200).json({
      success: true,
      message: 'Photo uploaded and registered successfully.',
      photo: photoData
    });

  } catch (error) {
    console.error('❌ [Admin Photo Upload Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process and upload photo.'
    });
  }
};

/**
 * Retrieves all bookings with customer details to display in the Kanban board.
 * ROUTE: GET /api/admin/bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!bookings_customer_id_fkey (*),
        repair_photos (*),
        warranties (*),
        approval_requests (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      bookings: data
    });
  } catch (error) {
    console.error('❌ [Admin Fetch Bookings Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch bookings.'
    });
  }
};
