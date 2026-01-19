import { Router } from "express";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import {
  login,
  me,
  register,
  updateRole,
  logout,
} from "../controllers/auth.controller.js";
import { validateForm, authorize, auth } from "../middlewares/index.js";
import { Role } from "../../generated/prisma/enums.js";

const router = Router();

router.post("/register", validateForm(registerSchema), register);
router.post("/login", validateForm(loginSchema), login);
router.put("/update-role/:id", auth, authorize(Role.ADMIN), updateRole);
router.get("/me", auth, me);
router.post("/logout", auth, logout);
export default router;
