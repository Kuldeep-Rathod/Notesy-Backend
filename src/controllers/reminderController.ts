import { Request, Response } from 'express';
import schedule from 'node-schedule';
import { Note } from '../models/notesModel.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// HTML template for reminder emails
const getReminderEmailTemplate = (
    noteTitle: string,
    noteBody: string,
    reminderTime: Date,
    noteId: string
) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reminder: ${noteTitle}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #4a6fa5;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
            }
            .content {
                padding: 20px;
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                border-top: none;
            }
            .note-card {
                background-color: white;
                border-left: 4px solid #4a6fa5;
                padding: 15px;
                margin: 15px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .note-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #2c3e50;
            }
            .note-content {
                margin-bottom: 15px;
                white-space: pre-wrap;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #4a6fa5;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 10px;
            }
            .reminder-time {
                font-style: italic;
                color: #666;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Reminder from Notesy</h1>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            <p>This is a reminder about your note:</p>
            
            <div class="note-card">
                <div class="note-title">${noteTitle || 'Untitled Note'}</div>
                <div class="note-content">${noteBody || 'You have a note reminder.'}</div>
                <div class="reminder-time">Reminder set for: ${reminderTime.toLocaleString()}</div>
                <a href="${process.env.CLIENT_URL || 'https://yourapp.com'}/dashboard" class="button">View Note</a>
            </div>
            
            <p>If you no longer need this reminder, you can dismiss it in the app.</p>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} Notesy. All rights reserved.</p>
                <p>
                    <a href="${process.env.CLIENT_URL || 'https://yourapp.com'}/unsubscribe">Unsubscribe</a> | 
                    <a href="${process.env.CLIENT_URL || 'https://yourapp.com'}/preferences">Notification Preferences</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

const sendReminderEmail = async (
    to: string,
    subject: string,
    html: string,
    text: string
) => {
    try {
        const { data, error } = await resend.emails.send({
            from:
                process.env.RESEND_FROM_EMAIL ||
                'Notes App <onboarding@resend.dev>',
            to,
            subject,
            html,
            text, // Fallback text version
        });

        if (error) {
            console.error('Error sending email via Resend:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Unexpected error sending email via Resend:', error);
        throw error;
    }
};

// Controller to schedule reminder emails
export const scheduleReminders = async (req: Request, res: Response) => {
    try {
        const notes = await Note.find({
            reminder: { $gte: new Date() },
            trashed: false,
            archived: false,
        });

        if (!notes.length) {
            return res.status(200).json({
                message: 'No notes with upcoming reminders.',
            });
        }

        notes.forEach((note) => {
            const reminderTime = new Date(note.reminder!);

            schedule.scheduleJob(reminderTime, async () => {
                try {
                    const email = 'devcode.rtd@gmail.com'; // In production, use note.user.email
                    const subject = `Reminder: ${note.noteTitle || 'Untitled Note'}`;
                    const html = getReminderEmailTemplate(
                        note.noteTitle || '',
                        note.noteBody || '',
                        reminderTime,
                        (
                            note._id as string | number | { toString(): string }
                        ).toString()
                    );
                    const text = `Reminder: ${note.noteTitle || 'Untitled Note'}\n\n${
                        note.noteBody || 'You have a note reminder.'
                    }\n\nReminder set for: ${reminderTime.toLocaleString()}`;

                    await sendReminderEmail(email, subject, html, text);
                    console.log(`Reminder sent for note ${note._id}`);
                } catch (error) {
                    console.error(
                        `Failed to send reminder for note ${note._id}:`,
                        error
                    );
                }
            });
        });

        res.status(200).json({
            message: `${notes.length} reminder(s) scheduled.`,
        });
    } catch (error) {
        console.error('Error scheduling reminders:', error);
        res.status(500).json({ error: 'Failed to schedule reminders.' });
    }
};
