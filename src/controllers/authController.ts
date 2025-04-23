import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';

export const register = async (req: Request, res: Response) => {
    try {
        const token = await registerUser(req.body);
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    } catch (err) {
        res.status(401).json({ error: (err as Error).message });
    }
};
