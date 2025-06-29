import axios, { AxiosError } from "axios";
import { IUser } from "../../types/User/IUser";
import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import publicApiClient from "../interceptors/axios.publicApiClient";

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
  try {
    const response = await interceptorApiClient.post("/auth/login", {
      email,
      password,
    });
    console.log("hola " + response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log(error.response?.data);
      throw new Error(
        "Credenciales inválidas. Verifique su email y contraseña."
      );
    } else if (error.response?.status === 404) {
      console.log(error.response?.data);
      throw new Error("Usuario no encontrado.");
    } else if (error.response?.status >= 500) {
      console.log(error.response?.data);
      throw new Error("Error del servidor. Intente más tarde.");
    } else {
      console.log(error.response?.data);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión."
      );
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
      throw new Error(
        error.response?.data?.message || "Error al crear la cuenta."
      );
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
      throw new Error(
        error.response?.data?.message || "Error al cerrar sesión."
      );
    }
  }
};

export const autoRefreshToken = async () => {
  try {
    const refreshResponse = await axios.post<{ token: string }>(
      "/auth/refresh",
      {},
      {
        baseURL: "http://localhost:8081/api",
        withCredentials: true,
      }
    );
    const newToken = refreshResponse.data.token;
    return newToken;
  } catch (err) {
    console.log("No se pudo renovar el token.");
  }
};
