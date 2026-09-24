import express from 'express';
import { addVaccination, getVaccinationsByCow, getDueVaccinations } from '../controllers/vaccinationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// Routes mounted at /api/vaccinations
router.get('/due', getDueVaccinations);

// Routes mounted at /api/cows/:tagId/vaccinations
router.route('/')
  .post(addVaccination)
  .get(getVaccinationsByCow);

export default router;
