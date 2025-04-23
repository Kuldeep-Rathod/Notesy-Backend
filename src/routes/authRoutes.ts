import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);

export default router;
