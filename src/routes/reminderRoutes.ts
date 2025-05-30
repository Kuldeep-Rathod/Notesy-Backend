import express from 'express';
import { scheduleReminders } from '../controllers/reminderController.js';

const router = express.Router();

router.post('/schedule', scheduleReminders);

export default router;
