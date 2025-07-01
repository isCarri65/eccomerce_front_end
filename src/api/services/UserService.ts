import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IUser } from "../../types/User/IUser";

interface LoginResponse {
  token: string;
  refreshToken: string;
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
  try {
    const response = await interceptorApiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Credenciales inválidas. Verifique su email y contraseña.");
    } else if (error.response?.status === 404) {
      throw new Error("Usuario no encontrado.");
    } else if (error.response?.status >= 500) {
      throw new Error("Error del servidor. Intente más tarde.");
    } else {
      throw new Error(error.response?.data?.message || "Error al iniciar sesión.");
    }
  }
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await interceptorApiClient.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      throw new Error("El email ya está registrado.");
    } else if (error.response?.status === 400) {
      throw new Error("Datos inválidos. Verifique la información ingresada.");
    } else if (error.response?.status >= 500) {
      throw new Error("Error del servidor. Intente más tarde.");
    } else {
      throw new Error(error.response?.data?.message || "Error al crear la cuenta.");
    }
  }
};

export const logout = async (): Promise<void> => {
  try {
    await interceptorApiClient.post("/auth/logout");
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error("Sesión expirada.");
    } else if (error.response?.status >= 500) {
      throw new Error("Error del servidor. Intente más tarde.");
    } else {
      throw new Error(error.response?.data?.message || "Error al cerrar sesión.");
    }
  }
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
    `/protected/users/profile`,
    data
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/admin/users/${id}`);
};
