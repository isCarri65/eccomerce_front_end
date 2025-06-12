import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IType } from "../../types/Type/IType";

export const getAllTypes = async (): Promise<IType[]> => {
  const response = await interceptorApiClient.get("/types");
  return response.data;
};

export const getTypeById = async (id: number): Promise<IType> => {
  const response = await interceptorApiClient.get(`/types/${id}`);
  return response.data;
};

export const createType = async (data: IType): Promise<ICreateType> => {
  const response = await interceptorApiClient.post("/types", data);
  return response.data;
};

export const updateType = async (
  id: number,
  data: IType
): Promise<IUpdateType> => {
  const response = await interceptorApiClient.put<IType>(`/types/${id}`, data);
  return response.data;
};

export const deleteType = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/types/${id}`);
};
