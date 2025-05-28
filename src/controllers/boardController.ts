import { Response } from 'express';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { Board } from '../models/boardModel.js';

export const createBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { title, data } = req.body;
        const firebaseUid = req.user?.uid;

        const board = await Board.create({
            title,
            data,
            firebaseUid,
        });
        res.status(201).json(board);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getBoards = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUid = req.user!.uid;

        const boards = await Board.find({ firebaseUid }).sort({
            createdAt: -1,
        });
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getBoardById = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUid = req.user!.uid;

        const board = await Board.findOne({ _id: req.params.id, firebaseUid });
        if (!board) {
            res.status(404).json({
                message: 'Board not found or unauthorized',
            });
            return;
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const updateBoard = async (req: AuthRequest, res: Response) => {
    try {
        const { title, data } = req.body;
        const firebaseUid = req.user!.uid;

        const board = await Board.findOneAndUpdate(
            { _id: req.params.id, firebaseUid },
            { title, data, updatedAt: new Date() },
            { new: true }
        );

        if (!board) {
            res.status(404).json({
                message: 'Board not found or unauthorized',
            });
            return;
        }

        res.json(board);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const deleteBoard = async (req: AuthRequest, res: Response) => {
    try {
        const firebaseUid = req.user!.uid;

        const board = await Board.findOneAndDelete({
            _id: req.params.id,
            firebaseUid,
        });
        if (!board) {
            res.status(404).json({
                message: 'Board not found or unauthorized',
            });
            return;
        }

        res.json({ message: 'Board deleted' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
