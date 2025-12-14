import { Router } from "express";
import { validateForm } from "../middlewares/validate.middleware.js";
import {
  archiveProduct,
  createProduct,
  getProducts,
  restoreProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import {
  createQuerySchema,
  updateQuerySchema,
} from "../validations/product.validation.js";

const router = Router();

router.get("/", getProducts);
router.post("/", validateForm(createQuerySchema), createProduct);
router.put("/:id", validateForm(updateQuerySchema), updateProduct);
router.put("/:id/archive", archiveProduct);
router.put("/:id/restore", restoreProduct);

export default router;
