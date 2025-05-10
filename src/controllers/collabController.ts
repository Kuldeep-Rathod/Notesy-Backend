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

        if (!noteId || !emails || !Array.isArray(emails)) {
            res.status(400).json({
                success: false,
                message: 'Note ID and emails array are required',
            });
            return;
        }

        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({
                success: false,
                message: 'Note not found',
            });
            return;
        }
        // Check if user is the owner
        if (note.firebaseUid !== req.user.uid) {
            res.status(403).json({
                success: false,
                message: 'Only note owner can share the note',
            });
            return;
        }
        if (!note.sharedWith) note.sharedWith = [];

        // Lookup users by email
        const users = await User.find({ email: { $in: emails } });

        if (users.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No users found with provided emails',
            });
            return;
        }

        // Add users to sharedWith array (avoid duplicates)
        const userUids: string[] = users.map((user) => user.firebaseUid);
        note.sharedWith = [
            ...new Set([...(note.sharedWith || []), ...userUids]),
        ];

        await note.save();
        res.status(200).json({
            success: true,
            message: 'Note shared successfully',
            sharedWith: note.sharedWith,
        });
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

// 2. Get list of collaborators for a note
export const getCollaborators = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { noteId } = req.params;

        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }

        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({
                success: false,
                message: 'Note not found',
            });
            return;
        }

        if (
            note.firebaseUid !== req.user.uid &&
            !note.sharedWith?.includes(req.user.uid)
        ) {
            res.status(403).json({
                success: false,
                message: 'You do not have access to this note',
            });
            return;
        }

        // Updated query to use firebaseUid instead of uid
        const collaborators = await User.find({
            firebaseUid: { $in: note.sharedWith },
        }).select('firebaseUid email name photo');

        res.status(200).json({
            success: true,
            collaborators,
            ownerId: note.firebaseUid,
        });
        return;
    }
);

// 3. Remove a collaborator from note
export const removeCollaborator = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { noteId, userId }: { noteId: string; userId: string } = req.body;

        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }

        if (!noteId || !userId) {
            res.status(400).json({
                success: false,
                message: 'Note ID and user ID are required',
            });
            return;
        }

        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({
                success: false,
                message: 'Note not found',
            });
            return;
        }

        if (note.firebaseUid !== req.user.uid) {
            res.status(403).json({
                success: false,
                message: 'Only note owner can remove collaborators',
            });
            return;
        }

        if (!note.sharedWith?.includes(userId)) {
            res.status(400).json({
                success: false,
                message: 'User is not a collaborator on this note',
            });
            return;
        }

        note.sharedWith = note.sharedWith.filter((uid) => uid !== userId);
        await note.save();

        res.status(200).json({
            success: true,
            message: 'Collaborator removed successfully',
            sharedWith: note.sharedWith,
        });
        return;
    }
);

// 4. Leave a shared note (for collaborators)
export const leaveSharedNote = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { noteId }: { noteId: string } = req.body;

        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }

        const note = await Note.findById(noteId);
        if (!note) {
            res.status(404).json({
                success: false,
                message: 'Note not found',
            });
            return;
        }

        if (!note.sharedWith?.includes(req.user.uid)) {
            res.status(400).json({
                success: false,
                message: 'You are not a collaborator on this note',
            });
            return;
        }

        note.sharedWith = note.sharedWith.filter(
            (uid) => uid !== (req.user?.uid || '')
        );
        await note.save();

        res.status(200).json({
            success: true,
            message: 'You have successfully left the shared note',
        });
        return;
    }
);
