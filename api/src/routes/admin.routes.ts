import express from 'express';
import { isAdminCheck } from '../middlewares/isAdminAuthentication';
import { addDoctor, addNurse, deleteStaff, getAdminInfo } from '../controllers/admin.controllers';

const router = express.Router();

router.get('/:id', isAdminCheck, getAdminInfo);
router.post('/addDoctor', isAdminCheck, addDoctor);
router.post('/addNurse', isAdminCheck, addNurse);
router.delete('/delete/:id', isAdminCheck, deleteStaff);

export default router;