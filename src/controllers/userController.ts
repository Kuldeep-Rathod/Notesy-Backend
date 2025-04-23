import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService.js';

export const fetchUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
