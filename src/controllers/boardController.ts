import { Request, Response } from 'express';
import { Board } from '../models/boardModel.js';

export const createBoard = async (req: Request, res: Response) => {
    try {
        const { title, data } = req.body;
        const board = await Board.create({ title, data });
        res.status(201).json(board);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getBoards = async (_req: Request, res: Response) => {
    try {
        const boards = await Board.find().sort({ createdAt: -1 });
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const getBoardById = async (req: Request, res: Response) => {
    try {
        const board = await Board.findById(req.params.id);
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const updateBoard = async (req: Request, res: Response) => {
    try {
        const { title, data } = req.body;
        const board = await Board.findByIdAndUpdate(
            req.params.id,
            { title, data, updatedAt: new Date() },
            { new: true }
        );
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        res.json(board);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const deleteBoard = async (req: Request, res: Response) => {
    try {
        const board = await Board.findByIdAndDelete(req.params.id);
        if (!board) {
            res.status(404).json({ message: 'Board not found' });
            return;
        }
        res.json({ message: 'Board deleted' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};
