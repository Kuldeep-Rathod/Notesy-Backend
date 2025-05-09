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
import {
    getNotesSharedWithMe,
    shareNote,
    getCollaborators,
    removeCollaborator,
    leaveSharedNote,
} from '../controllers/collabController.js';

const router = express.Router();

// Protect all routes
router.use(isAuthenticated);

// Notes routes
router.get('/', getUserNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.put('/:id/trash', moveNoteToBin);
router.put('/:id/restore', restoreNote);
router.get('/trashed', getTrashedNotes);
router.get('/archived', getArchivedNotes);

// Collaboration routes
router.post('/share', shareNote); // Share a note
router.get('/shared-with-me', getNotesSharedWithMe); // Notes shared with user
router.get('/:noteId/collaborators', getCollaborators); // Get collaborators of a note
router.post('/remove-collaborator', removeCollaborator); // Remove a collaborator
router.post('/leave-note', leaveSharedNote); // Collaborator leaves note

export default router;
