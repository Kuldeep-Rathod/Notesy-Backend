import { Router } from 'express';
import { fetchUsers } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.get('/', isAuthenticated, fetchUsers);

export default router;
