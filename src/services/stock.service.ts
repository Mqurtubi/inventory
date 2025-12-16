import { Type } from "../../generated/prisma/enums.js";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export const stockService = {
  async get() {
    const data = await prisma.stockMovement.findMany();
    return data;
  },
  async stockIn(productId: string, qty: number, userId: string) {
    return prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({
        data: {
          productId: productId,
          userId: userId,
          type: Type.IN,
          qty: qty,
        },
      }),
        await tx.product.update({
          where: { id: productId },
          data: {
            currentStock: { increment: qty },
          },
        });
    });
  },
  async stockOut(productId: string, qty: number, userId: string) {
    const findProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!findProduct || !findProduct.isActive) {
      throw new ApiError(404, "Product Inactive");
    }
    if (findProduct.currentStock < qty) {
      throw new ApiError(400, "Stock not enough");
    }
    return prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({
        data: {
          productId: productId,
          userId: userId,
          type: Type.OUT,
          qty: qty,
        },
      });
      await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: { decrement: qty },
        },
      });
    });
  },
};
