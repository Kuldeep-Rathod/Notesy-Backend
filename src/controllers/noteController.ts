import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Note } from '../models/notesModel.js';

export const createNote = async (req: AuthRequest, res: Response) => {
    try {
        const note = new Note({
            ...req.body,
            firebaseUid: req.user!.uid,
        });
        await note.save();
        res.status(201).json(note);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserNotes = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.uid;

        const notes = await Note.find({
            trashed: false,
            $or: [{ firebaseUid: userId }, { sharedWith: userId }],
        }).sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTrashedNotes = async (req: AuthRequest, res: Response) => {
    try {
        const notes = await Note.find({
            firebaseUid: req.user!.uid,
            trashed: true,
        }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getArchivedNotes = async (req: AuthRequest, res: Response) => {
    try {
        const notes = await Note.find({
            firebaseUid: req.user!.uid,
            archived: true,
        }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNote = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.uid;

            const note = await Note.findOneAndUpdate(
                {
                    _id: req.params.id,
                    $or: [{ firebaseUid: userId }, { sharedWith: userId }],
                },
                req.body,
                { new: true }
            );

            if (!note) {
                res.status(404).json({
                    message: 'Note not found or unauthorized',
                });
                return;
            }

            res.status(200).json(note);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
);

export const moveNoteToBin = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, firebaseUid: req.user!.uid },
            { trashed: true },
            { new: true }
        );
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json({
            message: 'Note moved to bin',
            note,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteNote = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            firebaseUid: req.user!.uid,
        });
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const restoreNote = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, firebaseUid: req.user!.uid },
            { trashed: false },
            { new: true }
        );
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }
        res.status(200).json({
            message: 'Note Restored',
            note,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
