import express from 'express';
import { generateAiNote } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-note', generateAiNote);

export default router;
