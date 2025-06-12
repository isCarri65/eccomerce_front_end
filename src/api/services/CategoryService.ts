import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { ICategory } from "../../types/Category/ICategory";
import publicApiClient from "../interceptors/axios.publicApiClient";

export const getAllCategorys = async (): Promise<ICategory[]> => {
  const response = await interceptorApiClient.get("/categories");
  return response.data;
};

export const getCategoryById = async (id: number): Promise<ICategory> => {
  const response = await interceptorApiClient.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (
  data: ICategory
): Promise<ICreateCategory> => {
  const response = await interceptorApiClient.post("/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: ICategory
): Promise<IUpdateCategory> => {
  const response = await interceptorApiClient.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/categories/${id}`);
};

export const getCategoriesByTypeId = async (
  id: number
): Promise<ICategory[]> => {
  const response = await publicApiClient.get(`/categories/getByTypeId/${id}`);
  return response.data;
};
