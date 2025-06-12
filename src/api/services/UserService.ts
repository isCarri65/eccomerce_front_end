import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IUser } from "../../types/User/IUser";

export const getAllUsers = async (): Promise<IUser[]> => {
  const response = await interceptorApiClient.get("api/admin/users");
  return response.data;
};

export const getUserById = async (id: number): Promise<IUser> => {
  const response = await interceptorApiClient.get(`api/admin/users/${id}`);
  return response.data;
};

export const getUserProfile = async (): Promise<IUser> => {
  const response = await interceptorApiClient.get(
    `api/protected/users/profile`
  );
  return response.data;
};
export const createUser = async (data: IUser): Promise<ICreateUser> => {
  const response = await interceptorApiClient.post("api/admin/users", data);
  return response.data;
};

export const updateUserProfile = async (data: IUser): Promise<IUpdateUser> => {
  const response = await interceptorApiClient.put(
    `api/protected/users/updateProfile`,
    data
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`api/admin/users/${id}`);
};
