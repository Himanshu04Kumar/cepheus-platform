import express from 'express';
import { initializeBookingWorkflow } from '../controllers/bookingController.js';

const router = express.Router();

// Route configuration pointing directly to our orchestration logic
router.post('/initialize', initializeBookingWorkflow);

export default router;