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
    sharedWith?: mongoose.Types.ObjectId[];
    trashed?: boolean;
    archived?: boolean;
    bgImage?: string;
    isCbox?: boolean;
}

const checklistItemSchema = new Schema<ChecklistItem>({
    text: { type: String, required: true },
    checked: { type: Boolean, default: false },
});

const noteSchema = new Schema<INote>(
    {
        firebaseUid: { type: String, ref: 'User', required: true },
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
        sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        trashed: { type: Boolean, default: false },
        bgImage: { type: String, default: '' },
        isCbox: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Note = mongoose.model<INote>('Note', noteSchema);
