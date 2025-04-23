import { User } from '../models/userModel.js';
import { log } from '../utils/logger.js';

export const getAllUsers = async () => {
    return await User.find();
};

export const getUserById = async (id: string) => {
    const res = await User.findById(id);

    return res;
};
