import { Router } from 'express';
import { fetchUsers, getUserProfile } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.get('/me', isAuthenticated, getUserProfile);
router.get('/', isAuthenticated, fetchUsers);

export default router;
