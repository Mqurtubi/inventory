import { Prisma } from "../../generated/prisma/client.js";
interface Query {
  page: number;
  limit: number;
  search?: string | undefined;
  isActive?: boolean | undefined;
  sortBy: string;
  order: string;
}

interface OptionsQuery {
  page: number;
  limit: number;
  skip: number;
  where: Prisma.ProductWhereInput;
  search?: string | undefined;
  isActive?: boolean | undefined;
  orderBy: Prisma.ProductOrderByWithRelationInput;
}

interface DataPostProduct {
  name: string;
  description: string;
  price: number;
  currentStock: number;
}

interface DataPutProduct {
  name?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  currentStock?: number | undefined;
}
export type { Query, OptionsQuery, DataPostProduct, DataPutProduct };
