import express from 'express';
import { authenticate } from '../middlewares/authentication';
import { findUserDetails, getUserAllAppointments, getUserInfo, updateUserInfo } from '../controllers/user.controllers';
const router = express.Router();

router.get('/', authenticate, getUserInfo);
router.get('/:id', authenticate, findUserDetails);
router.get('/:id/appointments', authenticate, getUserAllAppointments);
router.post('/:id/update', authenticate, updateUserInfo);

export default router;