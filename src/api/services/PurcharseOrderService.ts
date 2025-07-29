import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IPurchaseOrder } from "../../types/PurchaseOrder/IPurcharseOrder";

export const getAllPurchaseOrders = async (): Promise<IPurchaseOrder[]> => {
  const response = await interceptorApiClient.get("/purcharseOrders");
  return response.data;
};

export const getPurchaseOrderById = async (
  id: number
): Promise<IPurchaseOrder> => {
  const response = await interceptorApiClient.get(`/purchaseOrders/${id}`);
  return response.data;
};

export const createPurchaseOrder = async (
  data: IPurchaseOrder
): Promise<IPurchaseOrder> => {
  const response = await interceptorApiClient.post("/purchaseOrders", data);
  return response.data;
};

export const updatePurchaseOrder = async (
  id: number,
  data: IPurchaseOrder
): Promise<IPurchaseOrder> => {
  const response = await interceptorApiClient.put(
    `/purchaseOrders/${id}`,
    data
  );
  return response.data;
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/purchaseOrders/${id}`);
};

export const getAllPurchaseOrdersByUserProfile = async (): Promise<
  IPurchaseOrder[]
> => {
  const response = await interceptorApiClient.get(
    "/purchaseOrders/get-all-by-user-profile"
  );
  return response.data;
};
