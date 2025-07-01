import { ProductGenre } from "../enums/ProductGenre";

export interface IUpdateProduct {
  name: string;
  buyPrice: number;
  sellPrice: number;
  description: string;
  state: boolean;
  deleted: boolean;
  genre: ProductGenre;
  categoryIds: number[];
}
