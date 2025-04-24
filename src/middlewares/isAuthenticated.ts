import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IUser, User } from '../models/userModel.js';

export interface AuthRequest extends Request {
    user?: IUser & { _id: mongoose.Types.ObjectId };
}

export const isAuthenticated = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            email: string;
        };

        const user = await User.findOne({ email: decoded.email }).select(
            '-password'
        );
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
