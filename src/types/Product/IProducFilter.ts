import { ProductGenre } from "../enums/ProductGenre";

export interface IProductFilter {
  genre: ProductGenre | null;
  minPrice: number | null;
  maxPrice: number | null;
  colorId: number | null;
  categoryIds: number[] | null;
  typeId: number | null;
}
