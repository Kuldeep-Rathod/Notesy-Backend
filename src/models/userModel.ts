import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';
import validator from 'validator';

// Interface for User
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    firebaseUid: string;
    labels: string[];
    photo: string;
    stripeSubscriptionId?: string;
    isPremium?: boolean;
    planType?: 'monthly' | 'quarterly' | 'biannual' | 'annual';
    premiumExpiresAt?: Date | null;
    freeTrialStartDate?: Date;
    freeTrialEndDate?: Date;
    isInFreeTrial?: boolean;
    createdAt: Date;
    updatedAt: Date;
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
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
            required: false,
        },
        firebaseUid: {
            type: String,
            required: [true, 'Firebase UID is required'],
            unique: true,
        },
        labels: {
            type: [String],
            default: [],
        },

        photo: {
            type: String,
            default: null,
        },
        stripeSubscriptionId: {
            type: String,
            default: '',
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
        planType: {
            type: String,
            enum: ['monthly', 'quarterly', 'biannual', 'annual'],
            default: undefined,
        },
        premiumExpiresAt: {
            type: Date,
            default: null,
        },
        freeTrialStartDate: {
            type: Date,
            default: null,
        },
        freeTrialEndDate: {
            type: Date,
            default: null,
        },
        isInFreeTrial: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Export model
export const User = mongoose.model<IUser>('User', userSchema);
