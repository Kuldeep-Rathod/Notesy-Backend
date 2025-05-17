import express from 'express';
import {
    createCheckoutSession,
    createPortalSession,
} from '../controllers/paymentController.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.use(isAuthenticated);

router.post('/create-checkout-session', createCheckoutSession);
router.post('/create-portal-session', createPortalSession);

export default router;
