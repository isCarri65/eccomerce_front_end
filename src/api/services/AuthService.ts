import axios from "axios";
import { IUser } from "../../types/User/IUser";
import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import publicApiClient from "../interceptors/axios.publicApiClient";

interface LoginResponse {
  token: string;
  user: IUser;
  refreshToken: string;
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
  const response = await publicApiClient.post("/auth/login", {
    email,
    password,
  });
  console.log("hola " + response.data);
  return response.data;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await publicApiClient.post("/auth/register", data);
  return response.data;
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
      throw new Error(
        error.response?.data?.message || "Error al cerrar sesión."
      );
    }
  }
};

export const autoRefreshToken = async () => {
  try {
    const token = sessionStorage.getItem("refreshToken");
    console.log(token);
    const refreshResponse = await axios.post<{ token: string }>(
      "http://localhost:8081/api/auth/refresh",
      { refreshToken: { token } },
      {
        withCredentials: true,
      }
    );
    const newToken = refreshResponse.data.token;
    return newToken;
  } catch (err: any) {
    console.log(err.response?.data || err.message);
    console.log("No se pudo renovar el token.");
  }
};
