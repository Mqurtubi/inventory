import { Router } from "express";
import { getDashboardSummary } from "../controllers/summary.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(auth);

router.get("/", getDashboardSummary);
export default router;
