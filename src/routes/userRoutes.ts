import { Router } from 'express';
import {
    fetchAllUsers,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = Router();

router.get('/me', isAuthenticated, getUserProfile);
router.put('/profile', isAuthenticated, singleUpload, updateUserProfile);
router.get('/', isAuthenticated, fetchAllUsers);

export default router;
