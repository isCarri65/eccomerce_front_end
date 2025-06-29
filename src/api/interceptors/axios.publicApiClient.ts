import axios, { AxiosError, AxiosInstance } from "axios";
import Swal from "sweetalert2";
import { createHTTPError } from "../../utils/errors";

const BASE_URL = "http://localhost:8081/api";

// Crear instancia sin token
export const publicApiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de errores
publicApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as any)?.message;

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

    // Errores de red u otros
    Swal.fire({
      icon: "error",
      title: "Connection Error",
      text: "Unable to reach the server. Please check your internet connection or try again later.",
      confirmButtonColor: "#d33",
    });

    return Promise.reject(error);
  }
);

export default publicApiClient;
