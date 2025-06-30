import { IProduct } from "../product/IProduct";

export interface IFavoriteAdmin {
  id: number;
  product: IProduct;
  userId: number;
}
