import express from 'express';
import {
    getLabels,
    addLabel,
    editLabel,
    deleteLabel,
    attachLabelsToNote,
} from '../controllers/labelController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.use(isAuthenticated);

router.get('/all', getLabels);
router.post('/add', addLabel);
router.put('/edit', editLabel); // body: { oldLabel, newLabel }
router.delete('/delete/:label', deleteLabel);
router.put('/add/note/:id', attachLabelsToNote);

export default router;
