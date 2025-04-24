import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import NodeCache from 'node-cache';
import { connectDB } from './config/db.js';
import { errorMiddleware } from './middlewares/error.js';
import loggerMiddleware from './middlewares/loggerMiddleware.js';

//importing routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import labelRoutes from './routes/labelRoutes.js';
import collabRoutes from './routes/collabRoutes.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

export const myCache = new NodeCache();

app.get('/', (req, res) => {
    res.send(`Server is running on http://localhost:${port}`);
});

// using routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/note', noteRoutes);
app.use('/api/v1/label', labelRoutes);
app.use('/api/v1/collab', collabRoutes);

app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
