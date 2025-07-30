import express, { Request, Response } from 'express';
import { generateNoteWithGroq } from '../utils/groqClient.js';

const router = express.Router();

export const generateAiNote = async (req: Request, res: Response) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        res.status(400).json({ error: 'Invalid or missing prompt' });
        return;
    }

    try {
        const note = await generateNoteWithGroq(prompt);
        const now = new Date().toISOString();

        note.createdAt = now;
        note.updatedAt = now;

        res.status(200).json(note);
    } catch (err) {
        console.error('[AI Note Error]', err);
        res.status(500).json({
            error: 'Failed to generate note. Please try again.',
        });
    }
};

export default router;
