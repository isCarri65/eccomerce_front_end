import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IUser } from "../../types/User/IUser";

interface LoginResponse {
  token: string;
  user: IUser;
}

interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
}

// Funciones de autenticación
export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  console.log(email, password);
  const response = await interceptorApiClient.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await interceptorApiClient.post("/auth/register", data);
  return response.data;
};

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
  const response = await interceptorApiClient.get(`/protected/users/profile`);
  return response.data;
};

export const createUser = async (data: IUser): Promise<IUser> => {
  const response = await interceptorApiClient.post("/admin/users", data);
  return response.data;
};

export const updateUserProfile = async (data: IUser): Promise<IUser> => {
  const response = await interceptorApiClient.put(
    `/protected/users/updateProfile`,
    data
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/admin/users/${id}`);
};
