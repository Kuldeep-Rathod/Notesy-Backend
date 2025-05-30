import { Router } from 'express';
import {
    getNotesSharedWithMe,
    shareNote,
} from '../controllers/collabController.js';

const router = Router();

router.post('/share', shareNote);
router.get('/shared-with-me', getNotesSharedWithMe);

export default router;
