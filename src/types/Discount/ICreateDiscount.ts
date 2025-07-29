export interface ICreateDiscount {
  startDate: string; // ISO string (YYYY-MM-DD)
  endDate: string; // ISO string
  percentage: number;
  state: boolean;
  categoryId?: number;
  productId?: number;
}
