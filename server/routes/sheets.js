import express from 'express';
import { logBlurTelemetry } from '../controllers/sheetsController.js';

const router = express.Router();

// Route for silent input-blur telemetry logging
router.post('/log-blur', logBlurTelemetry);

export default router;
