import { Router } from "express";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { login, register } from "../controllers/auth.controller.js";
import { validateForm } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/register", validateForm(registerSchema), register);
router.post("/login", validateForm(loginSchema), login);

export default router;
