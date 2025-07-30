import { IColor } from "../Color/IColor";
import { ISize } from "../Size/ISize";
import { IProductList } from "./IProductList";

export interface IProductVariantCART {
  id: number;
  productList: IProductList;
  size: ISize;
  color: IColor;
  stock: number;
  state: boolean;
  quantity: number;
}
