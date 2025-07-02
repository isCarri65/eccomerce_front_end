import { IColor } from "../Color/IColor";
import { ISize } from "../Size/ISize";

export interface IProductVariantCART {
  id: number;
  productId: number;
  size: ISize;
  color: IColor;
  quantity: number;
  state: boolean;
}
