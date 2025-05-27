import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
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
        title: { type: String, required: true },
        data: { type: Object, required: true },
    },
    { timestamps: true }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
