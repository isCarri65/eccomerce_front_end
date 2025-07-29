import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IDiscountRule } from "../../types/Discount/IDiscountRule";
import { ICreateDiscount } from "../../types/Discount/ICreateDiscount";
import { IUpdateDiscount } from "../../types/Discount/IUpdateDiscount";

export const getAllDiscounts = async (): Promise<IDiscountRule[]> => {
  const response = await interceptorApiClient.get("/discounts");
  return response.data;
};

export const getDiscountById = async (id: number): Promise<IDiscountRule> => {
  const response = await interceptorApiClient.get(`/discounts/${id}`);
  return response.data;
};

export const createDiscount = async (
  data: ICreateDiscount
): Promise<IDiscountRule> => {
  const response = await interceptorApiClient.post("/discounts", data);
  return response.data;
};

export const updateDiscount = async (
  id: number,
  data: IUpdateDiscount
): Promise<IDiscountRule> => {
  const response = await interceptorApiClient.put(`/discounts/${id}`, data);
  return response.data;
};

export const deleteDiscount = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/discounts/${id}`);
};
