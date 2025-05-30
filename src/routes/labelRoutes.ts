import express from 'express';
import {
    addLabel,
    attachLabelsToNote,
    deleteLabel,
    editLabel,
    getLabels,
} from '../controllers/labelController.js';

const router = express.Router();

router.get('/all', getLabels);
router.post('/add', addLabel);
router.put('/edit', editLabel); // body: { oldLabel, newLabel }
router.delete('/delete/:label', deleteLabel);
router.put('/add/note/:id', attachLabelsToNote);

export default router;
