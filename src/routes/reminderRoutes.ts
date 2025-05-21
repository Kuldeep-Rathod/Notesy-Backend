import express from 'express';
import { scheduleReminders } from '../controllers/reminderController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.use(isAuthenticated);

router.post('/schedule', scheduleReminders);

export default router;
