import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IPurchaseOrderDetail } from "../../types/PurchaseOrderDetail/IPurchaseOrderDetail";

export const getAllPurchaseOrderDetails = async (): Promise<
  IPurchaseOrderDetail[]
> => {
  const response = await interceptorApiClient.get("/protected/purchaseorderdetails");
  return response.data;
};

export const getPurchaseOrderDetailById = async (
  id: number
): Promise<IPurchaseOrderDetail> => {
  const response = await interceptorApiClient.get(
    `/protected/purchaseorderdetails/getAllByOrderId/${id}`
  );
  return response.data;
};

export const createPurchaseOrderDetail = async (
  data: IPurchaseOrderDetail
): Promise<ICreatePurchaseOrderDetail> => {
  const response = await interceptorApiClient.post(
    "/protected/purchaseorderdetails",
    data
  );
  return response.data;
};

export const updatePurchaseOrderDetail = async (
  id: number,
  data: IPurchaseOrderDetail
): Promise<IUpdatePurchaseOrderDetail> => {
  const response = await interceptorApiClient.put(
    `/protected/purchaseorderdetails/${id}`,
    data
  );
  return response.data;
};

export const deletePurchaseOrderDetail = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/protected/purchaseorderdetails/${id}`);
};
