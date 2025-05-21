import { Response } from 'express';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Note } from '../models/notesModel.js';

export const getNoteStats = async (req: AuthRequest, res: Response) => {
    const firebaseUid = req.user?.uid;

    try {
        const notes = await Note.find({ firebaseUid });

        let totalNotes = notes.length;
        let checklistStats = { completed: 0, incomplete: 0 };
        let labelMap: { [key: string]: number } = {};
        let pinned = 0,
            archived = 0,
            trashed = 0;
        let reminderCount = 0;
        let sharedNotes = 0;
        let bgColorMap: { [key: string]: number } = {};

        const reminderStats = {
            upcoming: 0,
            past: 0,
        };

        const now = new Date();

        notes.forEach((note) => {
            // Checklist
            note.checklists?.forEach((item) => {
                item.checked
                    ? checklistStats.completed++
                    : checklistStats.incomplete++;
            });

            // Labels
            note.labels?.forEach((label) => {
                labelMap[label] = (labelMap[label] || 0) + 1;
            });

            // Status flags
            if (note.pinned) pinned++;
            if (note.archived) archived++;
            if (note.trashed) trashed++;

            // Reminder
            if (note.reminder && !note.trashed && !note.archived) {
                reminderCount++;

                const reminderDate = new Date(note.reminder);
                if (reminderDate >= now) {
                    reminderStats.upcoming++;
                } else {
                    reminderStats.past++;
                }
            }

            // Sharing
            if (note.sharedWith && note.sharedWith.length > 1) sharedNotes++;

            // Background color
            if (note.bgColor) {
                bgColorMap[note.bgColor] = (bgColorMap[note.bgColor] || 0) + 1;
            }
        });

        const stats = {
            totalNotes,
            checklistStats,
            labelStats: labelMap,
            pinned,
            archived,
            trashed,
            reminderCount,
            reminderStats,
            sharedNotes,
            bgColorStats: bgColorMap,
        };

        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        console.error('Error fetching note stats:', err);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
