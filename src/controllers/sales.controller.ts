import { salesProduct } from "../services/sales.service.js";
import type { Request, Response, NextFunction } from "express";

const getDataSales = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const rawSearch = req.query.search;

    const search =
      typeof rawSearch === "string" && rawSearch.trim() !== ""
        ? rawSearch.trim()
        : undefined;

    console.log("normalized search:", search);

    const sales = await salesProduct.getSales(search);

    res.status(200).json({
      message: "success get sales data",
      data: sales,
    });
  } catch (error) {
    console.error(error); // <-- penting
    next(error);
  }
};

const getDataSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id!;
    const sale = await salesProduct.getSale(id);
    res.status(200).json({
      message: "success get sale data",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

const createDataSales = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, customer } = req.body;
    const userId = req.user!.id;
    const sale = await salesProduct.createSales(items, userId, customer);
    res.status(200).json({
      message: "success create sale data",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

export { getDataSales, getDataSale, createDataSales };
