import mongoose, { Document, Schema } from 'mongoose';

interface ChecklistItem {
    text: string;
    checked?: boolean;
}

export interface INote extends Document {
    firebaseUid: string;
    noteTitle?: string;
    noteBody?: string;
    audio?: { url?: string; transcription?: string };
    checklists?: ChecklistItem[];
    bgColor?: string;
    labels?: string[];
    pinned?: boolean;
    reminder?: Date;
    sharedWith?: string[];
    trashed?: boolean;
    archived?: boolean;
    bgImage?: string;
    images: string[];
    isCbox?: boolean;
}

const checklistItemSchema = new Schema<ChecklistItem>({
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
});

const noteSchema = new Schema<INote>(
    {
        firebaseUid: { type: String, required: true },
        noteTitle: { type: String, default: '' },
        noteBody: { type: String, default: '' },
        audio: {
            url: { type: String },
            transcription: { type: String },
        },
        checklists: [checklistItemSchema],
        bgColor: { type: String, default: '#ffffff' },
        labels: [{ type: String }],
        pinned: { type: Boolean, default: false },
        archived: { type: Boolean, default: false },
        reminder: { type: Date },
        sharedWith: [{ type: String }],
        trashed: { type: Boolean, default: false },
        bgImage: { type: String, default: '' },
        images: [{ type: String }],
        isCbox: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Virtual to populate user info from User model using firebaseUid
noteSchema.virtual('collaborators', {
    ref: 'User',
    localField: 'sharedWith',
    foreignField: 'firebaseUid',
    justOne: false,
});

// Enable virtuals when converting to JSON or Object
noteSchema.set('toObject', { virtuals: true });
noteSchema.set('toJSON', { virtuals: true });

export const Note = mongoose.model<INote>('Note', noteSchema);
