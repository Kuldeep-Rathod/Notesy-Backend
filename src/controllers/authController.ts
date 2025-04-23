import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const generateToken = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create(req.body);
    const token = generateToken(user.email);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
        .status(201)
        .json({ message: 'User registered successfully' });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user.email);

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
        expires: new Date(0),
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })
        .status(200)
        .json({ message: 'Logged out successfully' });
};
