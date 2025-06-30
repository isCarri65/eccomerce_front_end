import { ICategory } from "../Category/ICategory";
import { IProduct } from "../Product/IProduct";

export interface IDiscountRule {
  id: number; // Asume que hereda de Base con un campo id
  startDate: string; // ISO string (YYYY-MM-DD)
  endDate: string; // ISO string
  percentage: number;
  state: boolean;
  category?: ICategory;
  product?: IProduct;
}
