import { salesProduct } from "../services/sales.service.js";
import type { Request, Response, NextFunction } from "express";

const getDataSales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sales = await salesProduct.getSales();
    res.status(200).json({
      message: "success get sales data",
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

const getDataSale = async (req:Request, res:Response, next:NextFunction)=>{
    try {
        const id = req.params.id!
        const sale = await salesProduct.getSale(id)
        res.status(200).json({
            message:"success get sale data",
            data:sale
        })
    } catch (error) {
        next(error)
    }
}

const createDataSales = async (
  req: Request,
  res: Response,
  next: NextFunction
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
