import express from 'express';
import multer from 'multer';
import { 
  getAllBookings, 
  updateBookingStatus, 
  uploadDiagnosticPhoto 
} from '../controllers/adminController.js';

const router = express.Router();

// Memory storage configuration for Multer to receive stream files directly
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // Max 10MB file size limit
  }
});

// Route to fetch all bookings in detail
router.get('/bookings', getAllBookings);

// Route to modify the status of a specific repair order (e.g. from drag & drop)
router.patch('/bookings/:id/status', updateBookingStatus);

// Multipart route to upload, compress and link diagnostic images
router.post('/bookings/:id/upload-photo', upload.single('image'), uploadDiagnosticPhoto);

export default router;
