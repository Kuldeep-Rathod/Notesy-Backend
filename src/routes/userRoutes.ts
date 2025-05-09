import { Router } from 'express';
import {
    fetchAllUsers,
    getUserProfile,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.get('/me', isAuthenticated, getUserProfile);
router.get('/', isAuthenticated, fetchAllUsers);

export default router;
