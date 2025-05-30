import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import corsOptions from './config/corsOption.js';
import { connectDB } from './config/db.js';
import { handleStripeWebhook } from './controllers/paymentController.js';
import { scheduleFreeTrialCheck } from './jobs/freeTrialCheck.js';
import { errorMiddleware } from './middlewares/error.js';
import { registerRoutes } from './routes.js';

dotenv.config();
connectDB();

// Initialize the free trial check job
scheduleFreeTrialCheck();

const port = process.env.PORT || 3005;

const app = express();

// Stripe webhook endpoint must be before any body parsing middleware
app.post(
    '/api/v1/payment',
    bodyParser.raw({ type: 'application/json' }),
    handleStripeWebhook
);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send(`Server is running on ${port}`);
});

registerRoutes(app);

app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
