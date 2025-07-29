import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IColor } from "../../types/Color/IColor";
import { ICreateColor } from "../../types/Color/ICreateColor";
import { IUpdateColor } from "../../types/Color/IUpdateColor";

export const getAllColors = async (): Promise<IColor[]> => {
  const response = await interceptorApiClient.get("/public/colors");
  return response.data;
};
export const getColorById = async (id: number): Promise<IColor> => {
  const response = await interceptorApiClient.get(`/public/colors/${id}`);
  return response.data;
};
export const createColor = async (color: ICreateColor): Promise<IColor> => {
  const response = await interceptorApiClient.post("/public/colors", color);
  return response.data;
};

export const updateColor = async (
  id: number,
  color: IUpdateColor
): Promise<IColor> => {
  const response = await interceptorApiClient.put(
    `/public/colors/${id}`,
    color
  );
  return response.data;
};
export const deleteColor = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/public/colors/${id}`);
  // No return value for delete operation
};
