import { NextFunction, Request, Response } from 'express';
import admin from '../config/firebaseAdmin.js';

export interface AuthRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}

export const isAuthenticated = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Firebase Auth Error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};
