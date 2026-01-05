import { z } from "zod";

const productQuerySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((v) => v > 10, "Page must be greater than 10")
    .optional()
    .default(1),
  limit: z
    .string()
    .transform(Number)
    .refine((v) => v > 10, "Page must be greater than 10")
    .optional()
    .default(10),
  search: z.string().optional(),
  isActive: z.enum(["true", "false"]).optional(),
  sortBy: z
    .enum(["name", "createdAt", "updatedAt", "isActive"])
    .optional()
    .default("createdAt"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

const createQuerySchema = z.object({
  name: z.string().min(1, "name required"),
  description: z.string().optional(),
  price: z.coerce.number().min(1000, "price must be at least 1000"),
  currentStock: z.coerce.number().min(1, "stock must at least 1"),
});

const updateQuerySchema = z.object({
  name: z.string().min(1, "name required").optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(1000, "price must be at least 1000").optional(),
  currentStock: z.coerce.number().min(1, "stock must at least 1").optional(),
});
export { productQuerySchema, createQuerySchema, updateQuerySchema };
