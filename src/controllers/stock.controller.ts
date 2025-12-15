import type { Response,Request, NextFunction } from "express";
import { stockService } from "../services/stock.service.js";

const stockInProduct = async (req:Request, res:Response, next:NextFunction)=>{
    try {
    const {productId,qty}=req.body
    const userId= req.user?.id

    const stockIn= await stockService.stockIn(productId,qty,userId!)
    res.status(200).json({
        message:"stock in success",
        data:stockIn
    })  
    } catch (error) {
      next(error)  
    }
}

export {stockInProduct}