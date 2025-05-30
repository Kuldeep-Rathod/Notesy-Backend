import express from 'express';
import {
    getCollaborators,
    getNotesSharedWithMe,
    leaveSharedNote,
    removeCollaborator,
    shareNote,
} from '../controllers/collabController.js';
import {
    createNote,
    deleteNote,
    deleteSingleImage,
    getArchivedNotes,
    getTrashedNotes,
    getUserNotes,
    moveNoteToBin,
    restoreNote,
    updateNote,
} from '../controllers/noteController.js';
import { multipleUpload } from '../middlewares/multer.js';

const router = express.Router();

// Notes routes
router.get('/', getUserNotes);
router.post('/', multipleUpload, createNote);
router.delete('/image/:noteId', deleteSingleImage);
router.put('/:id', multipleUpload, updateNote);
router.delete('/:id', deleteNote);
router.put('/:id/trash', moveNoteToBin);
router.put('/:id/restore', restoreNote);
router.get('/trashed', getTrashedNotes);
router.get('/archived', getArchivedNotes);

// Collaboration routes
router.post('/share', shareNote);
router.get('/shared-with-me', getNotesSharedWithMe);
router.get('/:noteId/collaborators', getCollaborators);
router.post('/remove-collaborator', removeCollaborator);
router.post('/leave-note', leaveSharedNote);

export default router;
