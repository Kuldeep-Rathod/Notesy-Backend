import { Express } from 'express';

import { isAuthenticated } from './middlewares/isAuthenticated.js';
import authRoutes from './routes/authRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import labelRoutes from './routes/labelRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import userRoutes from './routes/userRoutes.js';

export const registerRoutes = (app: Express): void => {
    app.use('/api/v1/auth', authRoutes);

    app.use(isAuthenticated);

    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/notes', noteRoutes);
    app.use('/api/v1/labels', labelRoutes);
    app.use('/api/v1/boards', boardRoutes);
    app.use('/api/v1/reminder', reminderRoutes);
    app.use('/api/v1/pay', paymentRoutes);
    app.use('/api/v1/stats', statsRoutes);
};
