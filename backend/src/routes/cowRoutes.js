import express from 'express';
import { createCow, getCows, getCowByTagId, updateCow, deleteCow } from '../controllers/cowController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createCow)
  .get(getCows);

router.route('/:tagId')
  .get(getCowByTagId)
  .put(updateCow)
  .delete(deleteCow);

export default router;
