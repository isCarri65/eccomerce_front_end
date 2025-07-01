import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IUser } from "../../types/User/IUser";

// Funciones existentes
export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await interceptorApiClient.get("/admin/users");
  return response.data;
};

export const getUserById = async (id: number): Promise<IUser> => {
  const response = await interceptorApiClient.get(`/admin/users/${id}`);
  return response.data;
};

export const getUserProfile = async (): Promise<IUser> => {
  const response = await interceptorApiClient.get(`/profile`);
  return response.data;
};

export const createUser = async (data: IUser): Promise<IUser> => {
  const response = await interceptorApiClient.post("/admin/users", data);
  return response.data;
};

export const updateUserProfile = async (data: IUser): Promise<IUser> => {
  const response = await interceptorApiClient.put(`/profile`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/admin/users/${id}`);
};
