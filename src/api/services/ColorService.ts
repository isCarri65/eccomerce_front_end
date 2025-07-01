import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IColor } from "../../types/Color/IColor";
import { IUpdateColor } from "../../types/Color/IUpdateColor";

export const getAllColors = async (): Promise<IColor[]> => {
  const response = await interceptorApiClient.get("/colors");
  return response.data;
};
export const getColorById = async (id: number): Promise<IColor> => {
  const response = await interceptorApiClient.get(`/colors/${id}`);
  return response.data;
};
export const createColor = async (color: IColor): Promise<ICreateColor> => {
  const response = await interceptorApiClient.post("/colors", color);
  return response.data;
};

export const updateColor = async (
  id: number,
  color: IColor
): Promise<IUpdateColor> => {
  const response = await interceptorApiClient.put(`/colors/${id}`, color);
  return response.data;
};
export const deleteColor = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/colors/${id}`);
  // No return value for delete operation
};
