export type OrderState = "PAID" | "SHIPPED" | "DELIVERED";

export interface IOrder {
  id: number;
  userId: number;
  addressId: number;
  date: string;
  finalPrice: number;
  paymentMethod: string;
  state: OrderState;
}
