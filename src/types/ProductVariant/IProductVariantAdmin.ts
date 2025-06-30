import { ISize } from "../Size/ISize";
import { IColor } from "../Color/IColor";

export interface IProductVariantAdmin {
  id: number;
  quantity: number;
  state: boolean;
  deleted: boolean;
  productId: number;
  size: ISize;
  color: IColor;
}
