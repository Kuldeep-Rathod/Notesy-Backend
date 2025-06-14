import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const generateToken = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, firebaseUid, photo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error('User already exists');
    }

    const freeTrialStartDate = new Date();
    const freeTrialEndDate = new Date();
    freeTrialEndDate.setDate(freeTrialEndDate.getDate() + 7); // Add 7 days

    const user = await User.create({
        email,
        name,
        firebaseUid,
        photo,
        password: undefined,
        freeTrialStartDate,
        freeTrialEndDate,
        isInFreeTrial: true,
        isPremium: true,
    });

    // Generate JWT token for your backend API
    const token = generateToken(user.email);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            firebaseUid: user.firebaseUid,
            photo: user.photo,
            isInFreeTrial: user.isInFreeTrial,
            freeTrialEndDate: user.freeTrialEndDate,
        },
    });
});

export const checkUserExists = asyncHandler(async (req, res) => {
    const { email } = req.query;

    if (!email) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
    }

    res.status(200).json({ exists: true });
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
