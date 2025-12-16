import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Role } from "../../generated/prisma/enums.js";

export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, "forbidden");
    }
    next();
  };
