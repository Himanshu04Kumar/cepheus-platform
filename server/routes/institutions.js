import express from 'express';
import { onboardInstitution } from '../controllers/institutionController.js';

const router = express.Router();

// Route for institutional partner fleet onboarding applications
router.post('/onboard', onboardInstitution);

export default router;
