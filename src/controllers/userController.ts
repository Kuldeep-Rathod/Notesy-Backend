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
        const firebaseUid = req.user?.firebaseUid;
        const user = await User.findOne({ firebaseUid });
        res.json(user);
    }
);
