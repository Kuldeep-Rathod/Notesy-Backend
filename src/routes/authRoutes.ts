import { Router } from 'express';
import {
    checkUserExists,
    logout,
    register,
} from '../controllers/authController.js';

const router = Router();

router.post('/register', register);
router.get('/check', checkUserExists);
router.post('/logout', logout);

export default router;
