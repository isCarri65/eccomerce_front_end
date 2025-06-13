import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';


export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}login`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
}
export const register = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}register`, { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrarse');
  }
}
export const logout = async () => {
  try {
    await axios.post(`${API_URL}logout`);
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cerrar sesión');
  }
}