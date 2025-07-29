import { IPurchaseOrderDetailFull } from "../PurchaseOrderDetail/IPurchaseOrderDetailFull";
import { OrderState } from "./IPurcharseOrder";

export interface IPurchaseOrder {
  id: number;
  userId: number;
  addressId: number;
  date: string;
  finalPrice: number;
  paymentMethod: string;
  state: OrderState;
  purchaseOrderDetails?: IPurchaseOrderDetailFull[];
}
