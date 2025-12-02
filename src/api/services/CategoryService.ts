import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { ICategory } from "../../types/Category/ICategory";
import publicApiClient from "../interceptors/axios.publicApiClient";
import { ICreateCategory } from "../../types/Category/ICreateCategory";
import { IUpdateCategory } from "../../types/Category/IUpdateCategory";

export const getAllCategorys = async (): Promise<ICategory[]> => {
  const response = await interceptorApiClient.get("/public/categories");
  return response.data;
};

export const getCategoryById = async (id: number): Promise<ICategory> => {
  const response = await interceptorApiClient.get(`/public/categories/${id}`);
  return response.data;
};

export const createCategory = async (
  data: ICreateCategory
): Promise<ICategory> => {
  const response = await interceptorApiClient.post("/public/categories", data);
  return response.data;
};

export const updateCategory = async (
  id: number,
  data: IUpdateCategory
): Promise<ICategory> => {
  const response = await interceptorApiClient.put(
    `/public/categories/${id}`,
    data
  );
  return response.data;
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  const response = await interceptorApiClient.delete(`/public/categories/${id}`);
  console.log(response, "response");
  return response.status === 204;
};

export const getCategoriesByTypeId = async (
  id: number
): Promise<ICategory[]> => {
  const response = await publicApiClient.get(
    `/public/categories/getByTypeId/${id}`
  );
  return response.data;
};
