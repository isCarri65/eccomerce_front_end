import { IColor } from "../../types/Color/IColor";
import publicApiClient from "../interceptors/axios.publicApiClient";

export const getAllColors = async (): Promise<IColor[]> => {
  const response = await publicApiClient.get("/public/colors");
  return response.data;
};
export const getColorById = async (id: number): Promise<IColor> => {
  const response = await publicApiClient.get(`/public/colors/${id}`);
  return response.data;
};
export const createColor = async (color: IColor): Promise<ICreateColor> => {
  const response = await publicApiClient.post("/public/colors", color);
  return response.data;
};

export const updateColor = async (
  id: number,
  color: IColor
): Promise<IUpdateColor> => {
  const response = await publicApiClient.put(`/public/colors/${id}`, color);
  return response.data;
};
export const deleteColor = async (id: number): Promise<void> => {
  await publicApiClient.delete(`/public/colors/${id}`);
  // No return value for delete operation
};
