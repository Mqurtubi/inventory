import { Router } from "express";
import {
  createDataSales,
  getDataSale,
  getDataSales,
} from "../controllers/sales.controller.js";
import { auth,authorize } from "../middlewares/index.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router();

router.use(auth);

router.get("/",authorize(Role.ADMIN,Role.STAFF,Role.VIEWER), getDataSales);
router.get("/:id",authorize(Role.ADMIN,Role.STAFF,Role.VIEWER),getDataSale)
router.post("/",authorize(Role.ADMIN,Role.STAFF), createDataSales);

export default router;
