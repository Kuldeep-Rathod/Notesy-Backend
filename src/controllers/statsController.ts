import { Response } from 'express';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Note } from '../models/notesModel.js';
import { User } from '../models/userModel.js';

export const getNoteStats = async (req: AuthRequest, res: Response) => {
    const firebaseUid = req.user?.uid;

    try {
        const [notes, user] = await Promise.all([
            Note.find({ firebaseUid }),
            User.findOne({ firebaseUid }),
        ]);

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        let totalNotes = notes.length;
        let checklistStats = { completed: 0, incomplete: 0 };
        let labelMap: { [key: string]: number } = {};
        let pinned = 0,
            archived = 0,
            trashed = 0;
        let reminderCount = 0;
        let sharedNotes = 0;
        let bgColorMap: { [key: string]: number } = {};
        const reminderStats = { upcoming: 0, past: 0 };
        const now = new Date();
        const monthWiseStats: number[] = Array(12).fill(0);

        // Initialize labelMap with all user-defined labels (count starts at 0)
        user.labels.forEach((label) => {
            labelMap[label] = 0;
        });

        notes.forEach((note) => {
            // Checklist stats
            note.checklists?.forEach((item) => {
                item.checked
                    ? checklistStats.completed++
                    : checklistStats.incomplete++;
            });

            // Count only labels that exist in user's label list
            note.labels?.forEach((label) => {
                if (labelMap[label] !== undefined) {
                    labelMap[label]++;
                }
            });

            // Status flags
            if (note.pinned) pinned++;
            if (note.archived) archived++;
            if (note.trashed) trashed++;

            // Reminders
            if (note.reminder && !note.trashed && !note.archived) {
                reminderCount++;
                const reminderDate = new Date(note.reminder);
                reminderDate >= now
                    ? reminderStats.upcoming++
                    : reminderStats.past++;
            }

            // Shared notes
            if (note.sharedWith && note.sharedWith.length > 1) sharedNotes++;

            // Background color
            if (note.bgColor) {
                bgColorMap[note.bgColor] = (bgColorMap[note.bgColor] || 0) + 1;
            }

            // Monthly stats
            if (note.createdAt) {
                const createdMonth = new Date(note.createdAt).getMonth();
                monthWiseStats[createdMonth]++;
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
            monthlyNoteStats: {
                labels: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ],
                data: monthWiseStats,
            },
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
