import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService.js';
import asyncHandler from 'express-async-handler';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const token = await registerUser(req.body);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // use HTTPS in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .status(201)
        .json({ message: 'User registered successfully' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
        .status(200)
        .json({ message: 'Login successful' });
});

export const logout = (req: Request, res: Response): void => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Expire the cookie immediately
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })
        .status(200)
        .json({ message: 'Logged out successfully' });
};
