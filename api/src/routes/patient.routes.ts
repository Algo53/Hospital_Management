import express from 'express';
import { findPatientData, getAllPatientData, getPatientData, updatePatientData } from '../controllers/patient.controllers';
import { authenticate } from '../middlewares/authentication';

const router = express.Router();

router.get('/', getAllPatientData);
router.get('/:id', authenticate, getPatientData);
router.post('/find', authenticate, findPatientData);
router.post('/:id/update', authenticate, updatePatientData);

export default router;