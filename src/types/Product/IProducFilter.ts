import { ProductGenre } from "../enums/ProductGenre";

export interface IProductFilter {
  genre?: ProductGenre;
  minPrice?: number;
  maxPrice?: number;
  sizeId?: number;
  colorId?: number;
  categoryIds?: number[];
  typeId?: number;
}
