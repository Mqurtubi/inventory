import type { Response, Request, NextFunction } from "express";
import { stockService } from "../services/stock.service.js";

const getStockMovement = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await stockService.get();
    res.status(201).json({
      message: "sucess get movement stock",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const stockInProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user?.id;

    const stockIn = await stockService.stockIn(productId, qty, userId!);
    res.status(200).json({
      message: "stock in success",
      data: stockIn,
    });
  } catch (error) {
    next(error);
  }
};

const stockOutProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user?.id;

    const stockOut = await stockService.stockOut(productId, qty, userId!);
    res.status(200).json({
      message: "stock out success",
      data: stockOut,
    });
  } catch (error) {
    next(error);
  }
};

export { stockInProduct, getStockMovement, stockOutProduct };
