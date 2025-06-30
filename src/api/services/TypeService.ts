import publicApiClient from "../interceptors/axios.publicApiClient";
import { IType } from "../../types/Type/IType";

export const getAllTypes = async (): Promise<IType[]> => {
  const response = await publicApiClient.get("/public/types");
  return response.data;
};

export const getTypeById = async (id: number): Promise<IType> => {
  const response = await publicApiClient.get(`/public/types/${id}`);
  return response.data;
};

export const createType = async (data: IType): Promise<ICreateType> => {
  const response = await publicApiClient.post("/public/types", data);
  return response.data;
};

export const updateType = async (
  id: number,
  data: IType
): Promise<IUpdateType> => {
  const response = await publicApiClient.put<IType>(`/public/types/${id}`, data);
  return response.data;
};

export const deleteType = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/public/types/${id}`);
};
