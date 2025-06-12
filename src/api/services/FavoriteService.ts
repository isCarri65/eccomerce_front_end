import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IFavorite } from "../../types/Favorite/IFavorite";
import { IProduct } from "../../types/Product/IProduct";

export const getAllFavorites = async (): Promise<IFavorite[]> => {
  const response = await interceptorApiClient.get("/favorites");
  return response.data;
};

export const getFavoriteById = async (id: number): Promise<IFavorite> => {
  const response = await interceptorApiClient.get(`/favorites/${id}`);
  return response.data;
};

export const addFavorite = async (
  favorite: IFavorite
): Promise<ICreateFavorite> => {
  const response = await interceptorApiClient.post("/favorites", favorite);
  return response.data;
};

export const getProductsFavoritesByUserId = async (
  userId: number
): Promise<IProduct[]> => {
  const response = await interceptorApiClient.get(
    `/favorites/get-products-by-user-id/${userId}`
  );
  return response.data;
};

export const removeFavorite = async (
  userId: number,
  productId: number
): Promise<void> => {
  await interceptorApiClient.delete(
    `/favorites/remove/user-id/${userId}/product-id/${productId}`
  );
  // No return value for delete operation
};
