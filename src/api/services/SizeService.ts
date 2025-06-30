import publicApiClient from "../interceptors/axios.publicApiClient";
import { ISize } from "../../types/Size/ISize";

export const getAllSizes = async (): Promise<ISize[]> => {
  const response = await publicApiClient.get("/public/sizes");
  return response.data;
};

export const getSizeById = async (id: number): Promise<ISize> => {
  const response = await publicApiClient.get(`/public/sizes/${id}`);
  return response.data;
};

export const createSize = async (data: ISize): Promise<ICreateSize> => {
  const response = await publicApiClient.post("/public/sizes", data);
  return response.data;
};

export const updateSize = async (
  id: number,
  data: ISize
): Promise<IUpdateSize> => {
  const response = await publicApiClient.put(`/public/sizes/${id}`, data);
  return response.data;
};

export const deleteSize = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/public/sizes/${id}`);
};
