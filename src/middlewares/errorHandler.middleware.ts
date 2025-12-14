import { ApiError } from "../utils/ApiError.js";
import type { Response, Request, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error: " + err);

  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: "error",
      message: err.message,
    });
  }
  res.status(500).json({
    status: "error",
    message: "internal server error",
  });
};
