import express from 'express';
import { addNewPatient, bookAppointment, getAllNurseInfo, getNurseInfo } from '../controllers/nurse.controllers';
import { authenticate } from '../middlewares/authentication';

const router = express.Router();

router.get('/', getAllNurseInfo);
router.get('/:id', authenticate, getNurseInfo);
router.post('/:id/patient/add', authenticate, addNewPatient);
router.post('/:id/appointment/add', authenticate, bookAppointment);

export default router;