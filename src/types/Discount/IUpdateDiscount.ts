export interface IUpdateDiscount {
  startDate: string;
  endDate: string;
  percentage: number;
  state: boolean;
  categoryId?: number;
  productId?: number;
}
