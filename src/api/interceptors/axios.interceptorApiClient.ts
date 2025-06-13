import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import Swal from "sweetalert2";

//TODO: documentacion axios interceptor https://axios-http.com/docs/interceptors

import { createHTTPError } from "../../utils/errors";

const BASE_URL = "https://localhost:8081/api"; // Cambia si tu endpoint de auth es otro dominio

// Crear instancia
export const interceptorApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, //es la demora de una peticion hasta que se cancele
});

//TODO:TOKEN
// Helper para guardar el token nuevo
const saveToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};
// Helper para obtener el token del localStorage
const getToken = () => localStorage.getItem("accessToken");

// Intentar renovar token
const refreshToken = async () => {
  try {
    const refreshResponse = await axios.post(
      "/auth/refresh",
      {},
      {
        baseURL: BASE_URL,
        withCredentials: true,
      }
    );
    const newToken = refreshResponse.data.accessToken;
    saveToken(newToken);
    return newToken;
  } catch (err) {
    throw new Error("No se pudo renovar el token.");
  }
};

// Añadir token a cada request
interceptorApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuestas con lógica de renovación
interceptorApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    //toma el status
    const status = error.response?.status;
    //toma server message
    const serverMessage = (error.response?.data as any)?.message;

    //TODO:TOKEN
    //guarda la peticion que hicimos con el token viejo
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    //TODO:TOKEN
    // Intentar renovar token si es 401 y aún no reintentamos
    if (status === 401 || (status === 403 && !originalRequest._retry)) {
      originalRequest._retry = true; // le avisa que la peticion que hicimos con el token viejovolvera a ser llamada
      try {
        const newToken = await refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return interceptorApiClient(originalRequest); // Reintentar original
      } catch (refreshErr) {
        localStorage.removeItem("accessToken"); // Limpia si falla  del local
        Swal.fire({
          icon: "error",
          title: "Session expired",
          text: "Please log in again.",
          confirmButtonColor: "#d33",
        });
        return Promise.reject(refreshErr);
      }
    }

    // Si es error 500 genérico
    if (status === 500 && (!serverMessage || serverMessage.trim() === "")) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong on our end. Please try again later.",
        confirmButtonColor: "#d33",
      });
    } else if (status) {
      const httpError = createHTTPError(status, serverMessage);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: httpError.message,
        confirmButtonColor: "#d33",
      });
      return Promise.reject(httpError);
    }

    // Errores de red
    Swal.fire({
      icon: "error",
      title: "Connection Error",
      text: "Unable to reach the server. Please check your internet connection or try again later.",
      confirmButtonColor: "#d33",
    });

    return Promise.reject(error);
  }
);

export default interceptorApiClient;
