import type { Prisma } from "../../generated/prisma/client.js";

import type { Query } from "../types/product.type.js";

export const buildQueryOptions = (query: Query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search?.toString().trim();
  const isActive = query.isActive;
  const where: Prisma.ProductWhereInput = {};

  if (search) {
    where.OR = [{ name: { contains: search } }];
  }
  if (isActive) {
    where.isActive = isActive;
  }

  const allowedSort = ["name", "createdAt", "updatedAt", "isActive"];
  const allowedOrder = ["asc", "desc"];

  const sortBy = allowedSort.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const order = allowedOrder.includes(query.order) ? query.order : "desc";

  const orderBy = { [sortBy]: order };

  return { page, limit, skip, search, where, orderBy, isActive };
};
