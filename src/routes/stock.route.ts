import { Router } from "express";
import {
  getStockMovement,
  stockInProduct,
  stockOutProduct,
} from "../controllers/stock.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(auth);

router.get("/", getStockMovement);
router.post("/in", stockInProduct);
router.post("/out", stockOutProduct);

export default router;
