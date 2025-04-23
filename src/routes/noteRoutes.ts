import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import {
    createNote,
    deleteNote,
    getTrashedNotes,
    getUserNotes,
    moveNoteToBin,
    updateNote,
} from '../controllers/noteController.js';

const router = express.Router();

router.use(isAuthenticated);
router.post('/', createNote);
router.get('/', getUserNotes);
router.get('/bin', getTrashedNotes);
router.put('/:id/bin', moveNoteToBin);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
