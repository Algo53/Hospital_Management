import express from 'express';
import { assignNurseToDoctor, getAllDoctorInfo, getDoctorAssignedSlots, getDoctorInfo, updateAppointment } from '../controllers/doctor.controllers';
import { authenticate } from '../middlewares/authentication';

const router = express.Router();

router.get('/', getAllDoctorInfo);
router.get('/:id', authenticate, getDoctorInfo);
router.get('/:id/assignedSlots', getDoctorAssignedSlots);
router.post('/:id/assign/nurse', authenticate, assignNurseToDoctor);
router.post('/appointment/update/:id', authenticate, updateAppointment);

export default router;