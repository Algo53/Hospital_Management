import express from 'express';
import { getAllNurseInfo, getNurseInfo } from '../controllers/nurse.controllers';
import { authenticate } from '../middlewares/authentication';

const router = express.Router();

router.get('/', getAllNurseInfo);
router.get('/:id', authenticate, getNurseInfo);

export default router;