import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import {
    createNote,
    deleteNote,
    getArchivedNotes,
    getTrashedNotes,
    getUserNotes,
    moveNoteToBin,
    restoreNote,
    updateNote,
} from '../controllers/noteController.js';

const router = express.Router();

router.use(isAuthenticated);
router.get('/', getUserNotes);
router.post('/', createNote);
router.get('/trashed', getTrashedNotes);
router.get('/archived', getArchivedNotes);
router.put('/:id/trash', moveNoteToBin);
router.put('/:id/restore', restoreNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
