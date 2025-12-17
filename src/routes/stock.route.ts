import { Router } from "express";
import {
  getStockMovement,
  stockInProduct,
  stockOutProduct,
} from "../controllers/stock.controller.js";
import { auth,authorize } from "../middlewares/index.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router();
router.use(auth);

router.get("/",authorize(Role.ADMIN,Role.STAFF,Role.VIEWER), getStockMovement);
router.post("/in",authorize(Role.ADMIN,Role.STAFF), stockInProduct);
router.post("/out",authorize(Role.ADMIN,Role.STAFF), stockOutProduct);

export default router;
