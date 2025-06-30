import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IFavorite } from "../../types/Favorite/IFavorite";
import { IProduct } from "../../types/Product/IProduct";

export const getAllFavorites = async (): Promise<IFavorite[]> => {
  const response = await interceptorApiClient.get("/protected/favorites/getProducts");
  return response.data;
};

export const getFavoriteById = async (id: number): Promise<IFavorite> => {
  const response = await interceptorApiClient.get(`/protected/favorites/${id}`);
  return response.data;
};

export const addFavorite = async (
  favorite: IFavorite
): Promise<ICreateFavorite> => {
  const response = await interceptorApiClient.post("/protected/favorites", favorite);
  return response.data;
};

export const getProductsFavoritesByUserId = async (
  userId: number
): Promise<IProduct[]> => {
  const response = await interceptorApiClient.get(
    `/protected/favorites/get-products-by-user-id/${userId}`
  );
  return response.data;
};

export const removeFavorite = async (
  productId: number
): Promise<void> => {
  await interceptorApiClient.delete(
    `/protected/favorites/remove/${productId}`
  );
};
