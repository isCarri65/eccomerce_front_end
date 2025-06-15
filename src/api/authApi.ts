import axios from "axios";
import { RegisterValues, User } from "../types/User/authTypes";

const API_URL = "https://tu-backend.com/api"; // reemplazalo por tu URL real

export const login = async (email: string, password: string): Promise<User> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (data: RegisterValues): Promise<User> => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};
