import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
    firebaseUid: string;
    title: string;
    data: {
        elements: any[];
        appState: any;
        files: any;
    };
    createdAt: Date;
    updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
    {
        firebaseUid: { type: String, required: true },
        title: { type: String, required: true },
        data: { type: Object, required: true },
    },
    { timestamps: true }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
