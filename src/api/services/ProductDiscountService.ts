import { IProductDiscount } from "../../types/ProductDiscount/IProductDiscount";
import publicApiClient from "../interceptors/axios.publicApiClient";

export const getAllProductDiscounts = async (): Promise<IProductDiscount[]> => {
  const response = await publicApiClient.get("/public/productDiscounts");
  return response.data;
};

export const getProductDiscountById = async (
  id: number
): Promise<IProductDiscount> => {
  const response = await publicApiClient.get(`/public/productDiscounts/${id}`);
  return response.data;
};

export const createProductDiscount = async (
  data: IProductDiscount
): Promise<ICreateProductDiscount> => {
  const response = await publicApiClient.post("/public/productDiscounts", data);
  return response.data;
};

export const updateProductDiscount = async (
  id: number,
  data: IProductDiscount
): Promise<IUpdateProductDiscount> => {
  const response = await publicApiClient.put(
    `/public/productDiscounts/${id}`,
    data
  );
  return response.data;
};

export const deleteProductDiscount = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/public/productDiscounts/${id}`);
};
