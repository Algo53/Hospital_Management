import express from 'express';
import { authenticate } from '../middlewares/authentication';
import { getUserInfo, updateUserInfo } from '../controllers/user.controllers';
const router = express.Router();

router.get('/', authenticate, getUserInfo);
router.post('/:id/update', authenticate, updateUserInfo);

export default router;