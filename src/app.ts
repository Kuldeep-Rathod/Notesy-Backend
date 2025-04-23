import express from 'express';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import morgan from 'morgan';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.js';
import { connectDB } from './config/db.js';
import loggerMiddleware from './middlewares/loggerMiddleware.js';

//importing routes
import userRoute from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 3005;

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(morgan('dev'));
app.use(cors());

export const myCache = new NodeCache();

app.get('/', (req, res) => {
    res.send(`Server is running on http://localhost:${port}`);
});

// using routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoute);

app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
