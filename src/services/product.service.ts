import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prisma.js";
import type { DataPostProduct, OptionsQuery } from "../types/product.type.js";
import { generateSKU } from "../utils/generateSKU.js";
export const productService = {
  async getAll(options: OptionsQuery) {
    const { page, limit, skip, where, search, orderBy, isActive } = options;
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);
    return {
      page,
      limit,
      isActive,
      search,
      sortBy: Object.keys(orderBy)[0],
      orderBy: Object.values(orderBy)[0],
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  },
  async create(data: DataPostProduct) {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currentStock: data.currentStock,
      },
    });
    const sku = generateSKU(product.id);
    await prisma.product.update({
      where: { id: product.id },
      data: { sku },
    });
    return sku;
  },
  async update(id: string, data: DataPostProduct) {
    const findProduct = await prisma.product.findUnique({ where: { id: id } });
    if (!findProduct) {
      throw new ApiError(404, "product not found");
    }
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currentStock: data.currentStock,
      },
    });
    return product;
  },
  async archive(id: string) {
    return prisma.product.update({ where: { id }, data: { isActive: false } });
  },
  async restore(id: string) {
    return prisma.product.update({ where: { id }, data: { isActive: true } });
  },
};
