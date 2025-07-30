import { IColor } from "../Color/IColor";
import { ISize } from "../Size/ISize";

export interface IProductVariantCART {
  id: number;
  productId: number;
  size: ISize;
  color: IColor;
  urlImage: string;
  productName: string;
  stock: number;
  state: boolean;
  price: number;
  quantity: number;
}
