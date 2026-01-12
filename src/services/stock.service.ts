import { Type } from "../../generated/prisma/enums.js";
import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
export const stockService = {
  async get() {
    const data = await prisma.stockMovement.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return data;
  },
  async stockIn(productId: string, qty: number, userId: string, note?: string) {
    if (qty <= 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }
    return prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({
        data: {
          productId: productId,
          userId: userId,
          type: Type.IN,
          qty: qty,
          ...(note && { note }),
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
  async stockOut(
    productId: string,
    qty: number,
    userId: string,
    note?: string
  ) {
    if (qty < 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }
    return prisma.$transaction(async (tx) => {
      const findProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!findProduct || !findProduct.isActive) {
        throw new ApiError(404, "Product Inactive");
      }
      if (findProduct.currentStock < qty) {
        throw new ApiError(400, "Stock not enough");
      }
      await tx.stockMovement.create({
        data: {
          productId: productId,
          userId: userId,
          type: Type.OUT,
          qty: qty,
          ...(note && { note }),
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
  async adjustStock(
    productId: string,
    qty: number,
    userId: string,
    note?: string
  ) {
    if (qty < 0) {
      throw new ApiError(400, "Quantity must be greater than 0");
    }
    return prisma.$transaction(async (tx) => {
      const findProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!findProduct || !findProduct.isActive) {
        throw new ApiError(404, "Product Inactive");
      }
      const diff = qty - findProduct.currentStock;

      if (diff === 0) {
        return {
          message: "No adjustment needed",
          currentStock: findProduct.currentStock,
        };
      }
      await tx.stockMovement.create({
        data: {
          productId: productId,
          userId: userId,
          type: Type.ADJUST,
          qty: diff,
          ...(note && { note }),
        },
      });
      await tx.product.update({
        where: { id: productId },
        data: {
          currentStock: qty,
        },
      });
    });
  },
};
