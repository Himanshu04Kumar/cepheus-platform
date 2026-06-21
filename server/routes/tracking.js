import express from 'express';
import { getTrackingRecord, updateGateApproval } from '../controllers/trackingController.js';

const router = express.Router();

// Route to fetch tracking status of a specific booking
router.get('/:id', getTrackingRecord);

// Route for customer gate authorization responses
router.post('/:id/gate-approval', updateGateApproval);

export default router;
