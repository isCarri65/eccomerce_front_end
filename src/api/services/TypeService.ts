import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IType } from "../../types/Type/IType";
import { ICreateType } from "../../types/Type/ICreateType";
import { IUpdateType } from "../../types/Type/IUpdateType";

export const getAllTypes = async (): Promise<IType[]> => {
  const response = await interceptorApiClient.get("/public/types");
  return response.data;
};

export const getTypeById = async (id: number): Promise<IType> => {
  const response = await interceptorApiClient.get(`/public/types/${id}`);
  return response.data;
};

export const createType = async (data: ICreateType): Promise<ICreateType> => {
  const response = await interceptorApiClient.post("/public/types", data);
  return response.data;
};

export const updateType = async (
  id: number,
  data: IType
): Promise<IUpdateType> => {
  const response = await interceptorApiClient.put<IUpdateType>(`/public/types/${id}`, data);
  return response.data;
};

export const deleteType = async (id: number): Promise<boolean> => {
  const response = await interceptorApiClient.delete(`/public/types/${id}`);
  console.log(response, "response");
  return response.status === 204;
};
