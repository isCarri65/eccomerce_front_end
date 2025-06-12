import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { ISize } from "../../types/Size/ISize";

export const getAllSizes = async (): Promise<ISize[]> => {
  const response = await interceptorApiClient.get("/sizes");
  return response.data;
};

export const getSizeById = async (id: number): Promise<ISize> => {
  const response = await interceptorApiClient.get(`/sizes/${id}`);
  return response.data;
};

export const createSize = async (data: ISize): Promise<ICreateSize> => {
  const response = await interceptorApiClient.post("/sizes", data);
  return response.data;
};

export const updateSize = async (
  id: number,
  data: ISize
): Promise<IUpdateSize> => {
  const response = await interceptorApiClient.put(`/sizes/${id}`, data);
  return response.data;
};

export const deleteSize = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/sizes/${id}`);
};
