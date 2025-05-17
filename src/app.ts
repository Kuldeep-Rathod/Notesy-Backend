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
import labelRoutes from './routes/labelRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 3005;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.200.34:3000'], // Allow all domains
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true,
};

const app = express();

// app.post(
//     '/api/payments',
//     bodyParser.raw({ type: 'application/json' }),
//     handleStripeWebhook
// );

app.use(express.json());
app.use(loggerMiddleware);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsOptions));

export const myCache = new NodeCache();

app.get('/', (req, res) => {
    res.send(`Server is running on http://localhost:${port}`);
});

// Payment routes

app.use('/api/v1/pay', paymentRoutes);

// using routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/notes', noteRoutes);
app.use('/api/v1/labels', labelRoutes);

app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
