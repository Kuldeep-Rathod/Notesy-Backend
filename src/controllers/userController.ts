import { Request, Response } from 'express';
import { getAllUsers, getUserById } from '../services/userService.js';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';

export const fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.json(users);
});

export const getUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const id = req.user?.id;
        const user = await getUserById(id);
        res.json(user);
    }
);
