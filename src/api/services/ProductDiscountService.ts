import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IProductDiscount } from "../../types/ProductDiscount/IProductDiscount";

export const getAllProductDiscounts = async (): Promise<IProductDiscount[]> => {
  const response = await interceptorApiClient.get("/productDiscounts");
  return response.data;
};

export const getProductDiscountById = async (
  id: number
): Promise<IProductDiscount> => {
  const response = await interceptorApiClient.get(`/productDiscounts/${id}`);
  return response.data;
};

export const createProductDiscount = async (
  data: IProductDiscount
): Promise<ICreateProductDiscount> => {
  const response = await interceptorApiClient.post("/productDiscounts", data);
  return response.data;
};

export const updateProductDiscount = async (
  id: number,
  data: IProductDiscount
): Promise<IUpdateProductDiscount> => {
  const response = await interceptorApiClient.put(
    `/productDiscounts/${id}`,
    data
  );
  return response.data;
};

export const deleteProductDiscount = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/productDiscounts/${id}`);
};
