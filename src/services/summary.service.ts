import { prisma } from "../config/prisma.js";
import { startOfDay, endOfDay, getMonthRange } from "../utils/date.js";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const calculathhGrowth = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const summaryService = {
  async getSummary() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(today);
    const { start: lastMonthStart, end: lastMonthEnd } = getMonthRange(
      new Date(today.getFullYear(), today.getMonth() - 1, 1),
    );
    const [
      totalProducts,
      thisMonthProduct,
      lastMonthProduct,
      totalStockAgg,
      todaySaleAgg,
      yesterdaySaleAgg,
      weeklySaleRaw,
      lowStockProducts,
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({
        where: { createdAt: { gte: thisMonthStart, lte: thisMonthEnd } },
      }),
      prisma.product.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      prisma.product.aggregate({
        where: { isActive: true },
        _sum: { currentStock: true },
      }),
      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
        _sum: { total: true },
      }),
      prisma.sale.aggregate({
        where: {
          createdAt: {
            gte: startOfDay(yesterday),
            lte: endOfDay(yesterday),
          },
        },
        _sum: { total: true },
      }),
      prisma.sale.findMany({
        where: {
          createdAt: { gte: weekStart },
        },
        select: {
          createdAt: true,
          total: true,
        },
      }),
      prisma.product.findMany({
        where: {
          isActive: true,
          currentStock: {
            lt: prisma.product.fields.minStock,
          },
        },
        select: {
          name: true,
          currentStock: true,
          minStock: true,
        },
        orderBy: { currentStock: "asc" },
        take: 5,
      }),
    ]);
    const todaySales = todaySaleAgg._sum.total ?? 0;
    const yesterdaySales = yesterdaySaleAgg._sum.total ?? 0;

    const todayGrowth = calculathhGrowth(todaySales, yesterdaySales);
    const productGrowth = calculathhGrowth(thisMonthProduct, lastMonthProduct);

    const weeklyMap: Record<string, number> = {};

    weeklySaleRaw.forEach((sale) => {
      const day = DAYS[sale.createdAt.getDay()];
      if (!day) return;
      weeklyMap[day] = (weeklyMap[day] || 0) + sale.total;
    });

    const weeklySales = DAYS.map((day) => ({
      day,
      total: weeklyMap[day] || 0,
    }));

    return {
      totalProducts,

      totalStock: totalStockAgg._sum.currentStock ?? 0,
      productGrowth,
      todaySales,
      todayGrowth,
      lowStockCount: lowStockProducts.length,
      weeklySales,
      lowStockItems: lowStockProducts.map((item) => ({
        name: item.name,
        current: item.currentStock,
        min: item.minStock,
      })),
    };
  },
};
