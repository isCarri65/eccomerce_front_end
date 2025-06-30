import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IPurchaseOrder } from "../../types/PurchaseOrder/IPurcharseOrder";

export const getAllPurchaseOrders = async (): Promise<IPurchaseOrder[]> => {
  const response = await interceptorApiClient.get("/protected/purcharseOrders");
  return response.data;
};

export const getPurchaseOrderById = async (
  id: number
): Promise<IPurchaseOrder> => {
  const response = await interceptorApiClient.get(`/protected/purchaseOrders/${id}`);
  return response.data;
};

export const createPurchaseOrder = async (
  data: IPurchaseOrder
): Promise<ICreatePurchaseOrder> => {
  const response = await interceptorApiClient.post("/protected/purchaseOrders", data);
  return response.data;
};

export const updatePurchaseOrder = async (
  id: number,
  data: IPurchaseOrder
): Promise<IUpdatePurchaseOrder> => {
  const response = await interceptorApiClient.put(
    `/protected/purchaseOrders/${id}`,
    data
  );
  return response.data;
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/protected/purchaseOrders/${id}`);
};

export const getAllPurchaseOrdersByUserProfile = async (): Promise<
  IPurchaseOrder[]
> => {
  const response = await interceptorApiClient.get(
    "/protected/purchaseOrders/getAll"
  );
  return response.data;
};
