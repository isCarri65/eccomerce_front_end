import { OrderState } from "./IPurcharseOrder";

export interface IUpdatePurchaseOrder {
  userId: number;
  addressId: number;
  date: string;
  finalPrice: number;
  paymentMethod: string;
  state: OrderState;
}
