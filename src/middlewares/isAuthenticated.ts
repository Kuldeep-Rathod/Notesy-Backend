import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel.js';

interface AuthRequest extends Request {
    user?: any;
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
