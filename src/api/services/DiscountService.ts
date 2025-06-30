import publicApiClient from "../interceptors/axios.publicApiClient";
import { IDiscount } from "../../types/Discount/IDiscount";

export const getAllDiscounts = async (): Promise<IDiscount[]> => {
  const response = await publicApiClient.get("/public/discounts");
  return response.data;
};

export const getDiscountById = async (id: number): Promise<IDiscount> => {
  const response = await publicApiClient.get(`/public/discounts/${id}`);
  return response.data;
};

export const createDiscount = async (
  data: IDiscount
): Promise<ICreateDiscount> => {
  const response = await publicApiClient.post("/public/discounts", data);
  return response.data;
};

export const updateDiscount = async (
  id: number,
  data: IDiscount
): Promise<IUpdateDiscount> => {
  const response = await publicApiClient.put(`/public/discounts/${id}`, data);
  return response.data;
};

export const deleteDiscount = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/public/discounts/${id}`);
};
