import type { Response, Request, NextFunction } from "express";
import { authService } from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createUser = await authService.register(req.body);
    res.status(201).json({
      message: "Register success",
      data: createUser,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginUser = await authService.login(req.body);
    res.status(201).json({
      message: "Login success",
      data: loginUser,
    });
  } catch (error) {
    next(error);
  }
};
export { register, login };
