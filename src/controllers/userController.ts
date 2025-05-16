import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middlewares/isAuthenticated.js';
import { User } from '../models/userModel.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const fetchAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const users = await User.find();
        res.json(users);
    }
);

export const getUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const firebaseUid = req.user?.uid;
        const user = await User.findOne({ firebaseUid });
        res.json(user);
    }
);

export const updateUserProfile = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const firebaseUid = req.user?.uid;
        const { name } = req.body;

        let imageUrl: string | undefined;

        const user = await User.findOne({ firebaseUid });

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (req.file) {
            if (user.photo && user.photo.includes('res.cloudinary.com')) {
                try {
                    const parts = user.photo.split('/');
                    const publicIdWithExtension = parts.slice(-1)[0];
                    const publicId = publicIdWithExtension.split('.')[0];
                    const folder = parts[parts.length - 2];
                    const cloudinaryPublicId = `${folder}/${publicId}`;

                    await cloudinary.uploader.destroy(cloudinaryPublicId);
                } catch (error) {
                    console.error(
                        'Error deleting image from Cloudinary:',
                        error
                    );
                }
            }

            const image = req.file as Express.Multer.File;

            const uploadResult = await cloudinary.uploader.upload(image.path, {
                folder: 'uploads',
                resource_type: 'auto',
            });

            imageUrl = uploadResult.secure_url;

            fs.unlinkSync(image.path);
        }

        const updateFields: { name?: string; photo?: string } = {};
        if (name) updateFields.name = name;
        if (imageUrl) updateFields.photo = imageUrl;

        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        res.json(updatedUser);
    }
);
