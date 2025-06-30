import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";

export interface IProductList {
  id: number;
  name: string;
  description: string;
  genre: ProductGenre;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockAvailable: boolean;
  categories: ICategory[];
  imageUrl: string;
}
