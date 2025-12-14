import type { Response, Request, NextFunction } from "express";
import { productService } from "../services/product.service.js";
import { ApiError } from "../utils/ApiError.js";
import { buildQueryOptions } from "../utils/buildQueryOptions.js";
import { productQuerySchema } from "../validations/product.validation.js";

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationQuery = productQuerySchema.parse(req.query);
    const options = buildQueryOptions(validationQuery);
    const product = await productService.getAll(options);
    res.json({
      message: "berhasil mengambil data product",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await productService.create(req.body);
    res.json({
      message: "Berhasil membuat product",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const product = await productService.update(id, req.body);
    res.json({
      message: "berhasil update product",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const archiveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const product = productService.archive(id);
    res.json({
      message: "berhasil archive product",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const restoreProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const product = productService.restore(id);
    res.json({
      message: "berhasil restore product",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
export {
  getProducts,
  createProduct,
  updateProduct,
  archiveProduct,
  restoreProduct,
};
