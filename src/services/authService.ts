import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const registerUser = async (data: any) => {
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error('User already exists');
    const user = await User.create(data);
    return generateToken(user.email);
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid email or password');
    }
    return generateToken(user.email);
};

const generateToken = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
    });
};
