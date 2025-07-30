import { IColor } from "../Color/IColor";
import { ISize } from "../Size/ISize";

export interface IProductVariant {
  id: number;
  productId: number;
  size: ISize;
  color: IColor;
  quantity: number;
  state: boolean;
}
