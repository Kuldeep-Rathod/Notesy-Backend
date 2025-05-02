import { Router } from 'express';
import {
    register,
    logout,
    checkUserExists,
} from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.post('/register', register);
router.get('/check', checkUserExists);
router.post('/logout', logout);

export default router;
