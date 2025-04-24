import { Router } from 'express';
import {
    getNotesSharedWithMe,
    shareNote,
} from '../controllers/collabController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = Router();

router.post('/share', isAuthenticated, shareNote);
router.get('/shared-with-me', isAuthenticated, getNotesSharedWithMe);

export default router;
