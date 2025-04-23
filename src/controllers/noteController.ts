import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { INote, Note } from '../models/notesModel.js';
import asyncHandler from 'express-async-handler';

export const createNote = async (req: AuthRequest, res: Response) => {
    try {
        const note = new Note({ ...req.body, userId: req.user!._id });
        await note.save();
        res.status(201).json(note);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserNotes = async (req: AuthRequest, res: Response) => {
    try {
        const notes = await Note.find({
            userId: req.user!._id,
            trashed: false, // optionally exclude trashed notes
        }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTrashedNotes = async (req: AuthRequest, res: Response) => {
    try {
        const notes = await Note.find({
            userId: req.user!._id,
            trashed: true,
        }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNote = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const note = await Note.findOneAndUpdate(
                { _id: req.params.id, userId: req.user!._id },
                req.body,
                { new: true }
            );
            if (!note) {
                res.status(404).json({ message: 'Note not found' });
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
            { _id: req.params.id, userId: req.user!._id },
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
            userId: req.user!._id,
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
