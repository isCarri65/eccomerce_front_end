import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IProduct } from "../../types/Product/IProduct";
import { ICreateProduct } from "../../types/Product/ICreateProduct";
import { IUpdateProduct } from "../../types/Product/IUpdateProduct";

export const getAllProducts = async (): Promise<IProduct[]> => {
  const response = await interceptorApiClient.get("/products");
  return response.data;
};

export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await interceptorApiClient.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: IProduct
): Promise<ICreateProduct> => {
  const response = await interceptorApiClient.post("/products", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: IProduct
): Promise<IUpdateProduct> => {
  const response = await interceptorApiClient.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/products/${id}`);
};
