import express from 'express';
import { analyzeSymptoms } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', analyzeSymptoms);

export default router;
