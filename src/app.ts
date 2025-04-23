import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'http2';
import NodeCache from 'node-cache';
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';

dotenv.config();

const port = process.env.PORT || 3005;
const mongoURI = process.env.MONGO_URI || '';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

connectDB(mongoURI);

export const myCache = new NodeCache();

app.get('/', (req, res) => {
    res.send(`Server is running on http://localhost:${port}`);
});

app.use('/uploads', express.static('uploads'));
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
