import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import Swal from "sweetalert2";

//TODO: documentacion axios interceptor https://axios-http.com/docs/interceptors

import { createHTTPError } from "../../utils/errors";
import { useAuthStore } from "../../stores/useAuthStore";

const BASE_URL = "http://localhost:8082/api"; // Cambia si tu endpoint de auth es otro dominio

//TODO:TOKEN

// Crear instancia
export const interceptorApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    withCredentials: true, // Permite enviar cookies con las peticiones
  },
  timeout: 10000, //es la demora de una peticion hasta que se cancele
});

// Intentar renovar token
const refreshToken = async () => {
  try {
    const setAccessToken = useAuthStore.getState().setAccessToken;
    const storedRefreshToken = sessionStorage.getItem("refreshToken");
    if (!storedRefreshToken)
      throw new Error("No hay refresh token para renovar la sesión.");

    const refreshResponse = await axios.post(
      "/auth/refresh",
      {},
      {
        baseURL: BASE_URL,
        headers: {
          Authorization: `Bearer ${storedRefreshToken}`,
        },
        withCredentials: true,
      }
    );

    const newAccessToken = refreshResponse.data.token;
    const newRefreshToken = refreshResponse.data.refreshToken;

    setAccessToken(newAccessToken);
    sessionStorage.setItem("refreshToken", newRefreshToken);

    return newAccessToken;
  } catch (err) {
    throw new Error("No se pudo renovar el token.");
  }
};

// Añadir token a cada request
interceptorApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers.set("Authorization", `Bearer ${accessToken}`);
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
    const clearAuth = useAuthStore.getState().clearAuth;

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
        clearAuth(); // Limpia si falla  del local
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
    console.log(error.message);
    return Promise.reject(error);
  }
);

export default interceptorApiClient;
