import express from "express";
import { getNoteStats } from "../controllers/statsController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", getNoteStats);

export default router;
