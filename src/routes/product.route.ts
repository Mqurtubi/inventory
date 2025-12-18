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
router.use(auth);

router.get("/", authorize(Role.ADMIN, Role.STAFF, Role.VIEWER), getProducts);
router.post(
  "/",
  authorize(Role.ADMIN),
  validateForm(createQuerySchema),
  createProduct
);
router.put(
  "/:id",
  authorize(Role.ADMIN),
  validateForm(updateQuerySchema),
  updateProduct
);
router.put("/:id/archive", authorize(Role.ADMIN), archiveProduct);
router.put("/:id/restore", authorize(Role.ADMIN), restoreProduct);

export default router;
