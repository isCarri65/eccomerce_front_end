import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { ISizeProduct } from "../../types/SizeProduct/ISizeProduct";

export const getAllSizeProducts = async (): Promise<ISizeProduct[]> => {
  const response = await interceptorApiClient.get("/sizeProducts");
  return response.data;
};

export const getSizeProductById = async (id: number): Promise<ISizeProduct> => {
  const response = await interceptorApiClient.get(`/sizeProducts/${id}`);
  return response.data;
};

export const createSizeProduct = async (
  data: ISizeProduct
): Promise<ICreateSizeProduct> => {
  const response = await interceptorApiClient.post("/sizeProducts", data);
  return response.data;
};

export const updateSizeProduct = async (
  id: number,
  data: ISizeProduct
): Promise<IUpdateSizeProduct> => {
  const response = await interceptorApiClient.put(`/sizeProducts/${id}`, data);
  return response.data;
};

export const deleteSizeProduct = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/sizeProducts/${id}`);
};
