import { User } from '../models/userModel.js';

export const getAllUsers = async () => {
    return await User.find();
};
