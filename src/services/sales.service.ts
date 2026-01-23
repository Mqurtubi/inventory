import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prisma.js";
import type { SalesItem } from "../types/sales.type.js";
import { Type } from "../../generated/prisma/enums.js";

export const salesProduct = {
  async getSales(search?: string) {
    const where = search
      ? {
          OR: [
            {
              customer: {
                contains: search,
              },
            },
            {
              code: {
                contains: search,
              },
            },
          ],
        }
      : {};

    return prisma.sale.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },
  async getSale(id: string) {
    const data = await prisma.sale.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    return data;
  },
  async createSales(items: SalesItem[], userId: string, customer?: string) {
    if (!items.length) {
      throw new ApiError(400, "sales item required");
    }
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          userId,
          ...(customer && { customer }),
          total: 0,
          code: `INV-${Date.now()}`,
        },
      });
      let total = 0;
      for (const item of items) {
        if (item.qty <= 0) {
          throw new ApiError(400, "Quantity must be greater than 0");
        }
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new ApiError(404, "produk inactive");
        }
        if (product.currentStock < item.qty) {
          throw new ApiError(400, `Stock not enough ${product.name}`);
        }
        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: product.id,
            qty: item.qty,
            price: product.price,
          },
        });
        await tx.stockMovement.create({
          data: {
            productId: product.id,
            userId,
            type: Type.OUT,
            qty: item.qty,
            note: `Sale ${sale.code}`,
          },
        });
        await tx.product.update({
          where: { id: product.id },
          data: {
            currentStock: { decrement: item.qty },
          },
        });
        total += product.price * item.qty;
      }
      return tx.sale.update({ where: { id: sale.id }, data: { total } });
    });
  },
};
