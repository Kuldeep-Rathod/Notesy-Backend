import express from 'express';
import { getNoteStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getNoteStats);

export default router;
