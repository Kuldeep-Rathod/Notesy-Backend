import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Interface for User
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    labels: string[];
    photo: string;
    gender: 'Male' | 'Female';
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema
const userSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter user name'],
        },
        email: {
            type: String,
            required: [true, 'Please enter user email'],
            unique: true,
            validate: validator.default.isEmail,
        },
        password: {
            type: String,
            required: [true, 'Please enter a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // won't be returned in queries unless explicitly selected
        },
        labels: [
            {
                type: String,
            },
        ],
        photo: {
            type: String,
            required: [true, 'Please add user photo'],
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: [true, 'Please enter user gender'],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Export model
export const User = mongoose.model<IUser>('User', userSchema);
