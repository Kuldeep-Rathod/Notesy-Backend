import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Note } from '../models/notesModel.js';
import { User } from '../models/userModel.js';

export const getLabels = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const firebaseUid = req.user?.uid;
        const user = await User.findOne({ firebaseUid });
        res.status(200).json(user?.labels || []);
    }
);

export const addLabel = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { label } = req.body;
        const firebaseUid = req.user?.uid;
        const user = await User.findOne({ firebaseUid });
        if (!user) throw new Error('User not found');

        if (!user.labels.includes(label)) {
            user.labels.push(label);
            await user.save();
        }

        res.status(201).json({ message: 'Label added', labels: user.labels });
    }
);

export const editLabel = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { oldLabel, newLabel } = req.body;
        const firebaseUid = req.user?.uid;
        const user = await User.findOne({ firebaseUid });
        if (!user) throw new Error('User not found');

        const index = user.labels.indexOf(oldLabel);
        if (index === -1) {
            res.status(404).json({ message: 'Label not found' });
            return;
        }

        user.labels[index] = newLabel;
        await user.save();

        await Note.updateMany(
            { firebaseUid: firebaseUid, labels: oldLabel },
            { $set: { 'labels.$': newLabel } }
        );

        res.status(200).json({ message: 'Label updated', labels: user.labels });
    }
);

export const deleteLabel = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { label } = req.params;
        const firebaseUid = req.user?.uid;
        const user = await User.findOne({ firebaseUid });
        if (!user) throw new Error('User not found');

        user.labels = user.labels.filter((l) => l !== label);
        await user.save();

        await Note.updateMany(
            { firebaseUid: firebaseUid },
            { $pull: { labels: label } }
        );

        res.status(200).json({ message: 'Label deleted', labels: user.labels });
    }
);

export const attachLabelsToNote = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        let { labels } = req.body;
        const firebaseUid = req.user?.uid;

        if (typeof labels === 'string') {
            labels = [labels];
        }

        if (!Array.isArray(labels)) {
            res.status(400).json({
                message: 'Labels must be a string or an array of strings',
            });
            return;
        }

        const note = await Note.findOne({
            _id: req.params.id,
            firebaseUid: firebaseUid,
        });
        if (!note) {
            res.status(404).json({ message: 'Note not found' });
            return;
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) throw new Error('User not found');

        labels.forEach((label: string) => {
            if (!user.labels.includes(label)) {
                user.labels.push(label);
            }
        });

        note.labels = Array.from(new Set([...(note.labels ?? []), ...labels]));

        await note.save();
        await user.save();

        res.status(200).json({ message: 'Label(s) attached to note', note });
    }
);
