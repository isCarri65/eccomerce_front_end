export interface IOrderDetail {
  id: number;
  orderId: string;
  productVariantId: string;
  discountId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
