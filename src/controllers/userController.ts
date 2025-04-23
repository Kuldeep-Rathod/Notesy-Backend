import { Request, Response } from 'express';
import { getAllUsers } from '../services/userService.js';
import asyncHandler from 'express-async-handler';

export const fetchUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.json(users);
});
