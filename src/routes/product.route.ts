import { Router } from "express";
import { validateForm, authorize, auth } from "../middlewares/index.js";
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
import { Role } from "../../generated/prisma/enums.js";

const router = Router();

router.get("/", getProducts);
router.post(
  "/",
  auth,
  authorize(Role.ADMIN),
  validateForm(createQuerySchema),
  createProduct
);
router.put(
  "/:id",
  auth,
  authorize(Role.ADMIN),
  validateForm(updateQuerySchema),
  updateProduct
);
router.put("/:id/archive", auth, authorize(Role.ADMIN), archiveProduct);
router.put("/:id/restore", auth, authorize(Role.ADMIN), restoreProduct);

export default router;
