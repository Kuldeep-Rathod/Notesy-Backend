import { Router } from 'express';
import {
    deleteUserProfile,
    fetchAllUsers,
    getUserProfile,
    updateUserProfile,
} from '../controllers/userController.js';
import { singleUpload } from '../middlewares/multer.js';

const router = Router();

router.get('/me', getUserProfile);
router.delete('/me', deleteUserProfile);
router.put('/profile', singleUpload, updateUserProfile);
router.get('/', fetchAllUsers);

export default router;
