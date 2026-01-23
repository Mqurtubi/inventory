interface SalesItem {
  productId: string;
  qty: number;
}
interface SalesQuery {
  search?: string | undefined;
}
export type { SalesItem, SalesQuery };
