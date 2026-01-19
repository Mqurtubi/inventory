import { summaryService } from "../services/summary.service.js";
import type { Response, Request, NextFunction } from "express";
const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await summaryService.getSummary();
    res.json({
      message: "berhasil mengambil data summary",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export { getDashboardSummary };
