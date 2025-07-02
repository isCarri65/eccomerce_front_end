import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { ISize } from "../../types/Size/ISize";
import { IUpdateSize } from "../../types/Size/IUpdateSize";
import { ICreateSize } from "../../types/Size/ICreateSize";

export const getAllSizes = async (): Promise<ISize[]> => {
  const response = await interceptorApiClient.get("/public/sizes");
  return response.data;
};

export const getSizeById = async (id: number): Promise<ISize> => {
  const response = await interceptorApiClient.get(`/public/sizes/${id}`);
  return response.data;
};

export const createSize = async (data: ISize): Promise<ICreateSize> => {
  const response = await interceptorApiClient.post("/public/sizes", data);
  return response.data;
};

export const updateSize = async (
  id: number,
  data: ISize
): Promise<IUpdateSize> => {
  const response = await interceptorApiClient.put(`/public/sizes/${id}`, data);
  return response.data;
};

export const deleteSize = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/public/sizes/${id}`);
};
