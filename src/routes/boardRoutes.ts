import { Router } from 'express';
import {
    createBoard,
    deleteBoard,
    getBoardById,
    getBoards,
    updateBoard,
} from '../controllers/boardController.js';

const router = Router();

router.post('/', createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
