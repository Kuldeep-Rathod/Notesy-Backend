import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Note } from '../models/notesModel.js';
import { User } from '../models/userModel.js';

// Share note using emails
export const shareNote = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { noteId, emails } = req.body;
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }
        const firebaseUid = req.user.uid;

        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({ error: 'Note not found' });
            return;
        }
        if (note.firebaseUid.toString() !== firebaseUid.toString()) {
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }
        if (!note.sharedWith) note.sharedWith = [];

        // Lookup users by email
        const users = await User.find({ email: { $in: emails } });

        // Check for non-existent emails
        const foundEmails = users.map((u) => u.email);
        const notFound = emails.filter(
            (email: string) => !foundEmails.includes(email)
        );
        if (notFound.length > 0) {
            res.status(400).json({ error: 'Some emails not found', notFound });
            return;
        }

        // Merge userIds with existing sharedWith list
        const currentShared = new Set(
            note.sharedWith.map((id) => id.toString())
        );
        users.forEach((user) => currentShared.add(user.firebaseUid.toString()));
        note.sharedWith = Array.from(currentShared).map((id) => id);

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    }
);

// Get notes shared with me
export const getNotesSharedWithMe = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }
        const firebaseUid = req.user.uid;
        const notes = await Note.find({
            sharedWith: firebaseUid,
            trashed: { $ne: true },
        });
        res.status(200).json(notes);
    }
);
