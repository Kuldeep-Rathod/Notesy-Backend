import mongoose, { Document, Schema } from 'mongoose';

interface ChecklistItem {
    text: string;
    checked?: boolean;
}

export interface INote extends Document {
    userId: mongoose.Types.ObjectId;
    title?: string;
    content?: string;
    images?: { url: string; alt?: string }[];
    drawings?: { dataUrl: string; description?: string }[];
    audio?: { url?: string; transcription?: string };
    checklists?: ChecklistItem[];
    color?: string;
    labels?: string[];
    pinned?: boolean;
    reminder?: Date;
    sharedWith?: mongoose.Types.ObjectId[];
    trashed?: boolean;
}

const checklistItemSchema = new Schema<ChecklistItem>({
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
});

const noteSchema = new Schema<INote>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, default: '' },
        content: { type: String, default: '' },
        images: [{ url: String, alt: { type: String, default: '' } }],
        drawings: [
            { dataUrl: String, description: { type: String, default: '' } },
        ],
        audio: {
            url: { type: String },
            transcription: { type: String },
        },
        checklists: [checklistItemSchema],
        color: { type: String, default: '#ffffff' },
        labels: [{ type: String }],
        pinned: { type: Boolean, default: false },
        reminder: { type: Date },
        sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        trashed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', noteSchema);
