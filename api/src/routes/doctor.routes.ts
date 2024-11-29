import express from 'express';
import { getAllDoctorInfo, getDoctorInfo } from '../controllers/doctor.controllers';
import { authenticate } from '../middlewares/authentication';

const router = express.Router();

router.get('/', getAllDoctorInfo);
router.get('/:id', authenticate, getDoctorInfo);

export default router;