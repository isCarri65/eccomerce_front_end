import { IProduct } from "../Product/IProduct";
import { IProductVariant } from "../Product/IProductVariant";

export interface IPurchaseOrderDetailFull {
  id: number;
  id_order: number;
  id_discount: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productVariant: IProductVariant;
  product: IProduct;
}
