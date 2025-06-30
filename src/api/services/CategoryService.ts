import { ICategory } from "../../types/Category/ICategory";
import publicApiClient from "../interceptors/axios.publicApiClient";

export const getAllCategorys = async (): Promise<ICategory[]> => {
  const response = await publicApiClient.get("/public/categories");
  return response.data;
};

export const getCategoryById = async (id: number): Promise<ICategory> => {
  const response = await publicApiClient.get(`/public/categories/${id}`);
  return response.data;
};

export const createCategory = async (
  data: ICategory
): Promise<ICreateCategory> => {
  const response = await publicApiClient.post("/public/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: ICategory
): Promise<IUpdateCategory> => {
  const response = await publicApiClient.put(`/public/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/categories/${id}`);
};

export const getCategoriesByTypeId = async (
  id: number
): Promise<ICategory[]> => {
  const response = await publicApiClient.get(`/public/categories/getByTypeId/${id}`);
  return response.data;
};
