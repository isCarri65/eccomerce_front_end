import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IDiscount } from "../../types/Discount/IDiscount";

export const getAllDiscounts = async (): Promise<IDiscount[]> => {
  const response = await interceptorApiClient.get("/discounts");
  return response.data;
};

export const getDiscountById = async (id: number): Promise<IDiscount> => {
  const response = await interceptorApiClient.get(`/discounts/${id}`);
  return response.data;
};

export const createDiscount = async (
  data: IDiscount
): Promise<ICreateDiscount> => {
  const response = await interceptorApiClient.post("/discounts", data);
  return response.data;
};

export const updateDiscount = async (
  id: number,
  data: IDiscount
): Promise<IUpdateDiscount> => {
  const response = await interceptorApiClient.put(`/discounts/${id}`, data);
  return response.data;
};

export const deleteDiscount = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/discounts/${id}`);
};
