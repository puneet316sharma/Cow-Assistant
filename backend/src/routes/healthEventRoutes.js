import express from 'express';
import { addHealthEvent, getHealthEventsByCow } from '../controllers/healthEventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .post(addHealthEvent)
  .get(getHealthEventsByCow);

export default router;
