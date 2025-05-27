import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  buyPrice: number;
  sellPrice: number;
  state: boolean;
  genre: ProductGenre;
  categories: ICategory[];
}
