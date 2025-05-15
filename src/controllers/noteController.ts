import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Note } from '../models/notesModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const createNote = async (req: AuthRequest, res: Response) => {
    try {
        //Parse checklists from JSON string if needed
        if (typeof req.body.checklists === 'string') {
            try {
                req.body.checklists = JSON.parse(req.body.checklists);
            } catch (err) {
                return res.status(400).json({
                    message: 'Invalid checklists format. Must be JSON.',
                });
            }
        }

        // If you also have labels or other arrays as strings, do the same:
        if (typeof req.body.labels === 'string') {
            req.body.labels = JSON.parse(req.body.labels);
        }

        const note = new Note({
            ...req.body,
            firebaseUid: req.user!.uid,
        });

        //Handle images
        if (Array.isArray(req.files) && req.files.length > 0) {
            const images = req.files as Express.Multer.File[];

            const imageUploadResults = await Promise.all(
                images.map((image) =>
                    cloudinary.uploader.upload(image.path, {
                        folder: 'uploads',
                        resource_type: 'auto',
                    })
                )
            );

            note.images = imageUploadResults.map((result) => result.secure_url);

            images.forEach((image) => fs.unlinkSync(image.path));
        }

        await note.save();
        res.status(201).json(note);
    } catch (error: any) {
        console.error('Error creating note:', error);
        res.status(500).json({
            message: error.message || 'Something went wrong.',
        });
    }
};

export const getUserNotes = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.uid;

        const notes = await Note.find({
            trashed: false,
            $or: [{ firebaseUid: userId }, { sharedWith: userId }],
        })
            .sort({ createdAt: -1 })
            .populate('collaborators');

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
        })
            .sort({ createdAt: -1 })
            .populate('collaborators');

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
        })
            .sort({ createdAt: -1 })
            .populate('collaborators');

        res.status(200).json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateNote = asyncHandler(
    async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user!.uid;

            if (typeof req.body.checklists === 'string') {
                try {
                    req.body.checklists = JSON.parse(req.body.checklists);
                } catch (err) {
                    res.status(400).json({
                        message: 'Invalid checklists format. Must be JSON.',
                    });
                    return;
                }
            }

            // If you also have labels or other arrays as strings, do the same:
            if (typeof req.body.labels === 'string') {
                req.body.labels = JSON.parse(req.body.labels);
            }

            // Find the note first
            const note = await Note.findOne({
                _id: req.params.id,
                $or: [{ firebaseUid: userId }, { sharedWith: userId }],
            });

            if (!note) {
                res.status(404).json({
                    message: 'Note not found or unauthorized',
                });
                return;
            }

            // Handle new image uploads
            let newImageUrls: string[] = [];

            if (Array.isArray(req.files) && req.files.length > 0) {
                const images = req.files as Express.Multer.File[];

                const uploadResults = await Promise.all(
                    images.map((image) =>
                        cloudinary.uploader.upload(image.path, {
                            folder: 'uploads',
                            resource_type: 'auto',
                        })
                    )
                );

                newImageUrls = uploadResults.map((result) => result.secure_url);

                // Cleanup local temp files
                images.forEach((image) => fs.unlinkSync(image.path));
            }

            // Merge new data with old images
            const updatedData = {
                ...req.body,
                images: [...(note.images || []), ...newImageUrls],
            };

            // Update the note
            const updatedNote = await Note.findByIdAndUpdate(
                note._id,
                updatedData,
                {
                    new: true,
                }
            ).populate('collaborators');

            res.status(200).json(updatedNote);
        } catch (error: any) {
            console.error('Update note error:', error);
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
        ).populate('collaborators');

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
        const note = await Note.findOne({
            _id: req.params.id,
            firebaseUid: req.user!.uid,
        });

        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        // Delete all images from Cloudinary
        if (Array.isArray(note.images) && note.images.length > 0) {
            const deletePromises = note.images.map((url) => {
                // Extract public ID from URL (e.g., uploads/filename)
                const publicId = url
                    .split('/')
                    .slice(-2)
                    .join('/')
                    .split('.')[0]; // remove extension

                return cloudinary.uploader.destroy(publicId, {
                    resource_type: 'image',
                });
            });

            await Promise.all(deletePromises);
        }

        // Delete the note itself
        await Note.deleteOne({ _id: note._id });

        res.status(200).json({
            message: 'Note and associated images deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete note error:', error);
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
        ).populate('collaborators');

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
