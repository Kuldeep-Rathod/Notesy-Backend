import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { User } from '../models/userModel.js';

export const fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find();
    res.json(users);
});

export const getUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const id = req.user?.id;
        const user = await User.findById(id);
        res.json(user);
    }
);
