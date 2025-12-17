import { Router } from "express";
import { auth } from "../middlewares/index.js";
import {
  createDataSales,
  getDataSales,
} from "../controllers/sales.controller.js";

const router = Router();

router.use(auth);

router.get("/", getDataSales);
router.post("/", createDataSales);

export default router;
