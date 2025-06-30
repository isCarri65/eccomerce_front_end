import publicApiClient from "../interceptors/axios.publicApiClient";
import { IProduct } from "../../types/Product/IProduct";


export const getAllProducts = async (): Promise<IProduct[]> => {
  const response = await publicApiClient.get("/public/products");
  return response.data;
};

export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await publicApiClient.get(`/public/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: IProduct
): Promise<ICreateProduct> => {
  const response = await publicApiClient.post("/public/products", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: IProduct
): Promise<IUpdateProduct> => {
  const response = await publicApiClient.put(`/public/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/public/products/${id}`);
};
