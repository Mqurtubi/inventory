import { Router } from "express";
import { stockInProduct } from "../controllers/stock.controller.js";
const router =Router()

router.post("/in",stockInProduct)

export default router