import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IProduct } from "../../types/Product/IProduct";
import { IUpdateProduct } from "../../types/Product/IUpdateProduct";
import { ICreateProduct } from "../../types/Product/ICreateProduct";
import { IProductVariantCART } from "../../types/Product/IProductVariantCART";
import { IProductFilter } from "../../types/Product/IProducFilter";
import { IPageableFilter } from "../../types/IPageableFilter";
import { IPage } from "../../types/IPage";

export const getProductVariantsByProductId = async (
  productId: number
): Promise<IProductVariantCART[]> => {
  const response = await interceptorApiClient.get(
    `/public/products/${productId}/variants`
  );
  return response.data;
};

export const getAllProducts = async (): Promise<IProduct[]> => {
  const response = await interceptorApiClient.get("/public/products");
  return response.data;
};

export const getProductById = async (id: number): Promise<IProduct> => {
  const response = await interceptorApiClient.get(`/public/products/${id}`);
  return response.data;
};

export const createProduct = async (
  data: ICreateProduct
): Promise<IProduct> => {
  const response = await interceptorApiClient.post("/public/products", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: IUpdateProduct
): Promise<IProduct> => {
  const response = await interceptorApiClient.put(
    `/public/products/${id}`,
    data
  );
  return response.data;
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const response = await interceptorApiClient.delete(`/public/products/${id}`);
  return response.status === 204;
};

export const getFilteredProducts = async (
  values: IProductFilter,
  pageable: IPageableFilter
): Promise<IPage<IProduct>> => {
  const params = new URLSearchParams();

  if (values.genre) params.append("genre", values.genre);
  if (values.minPrice) params.append("minPrice", values.minPrice.toString());
  if (values.maxPrice) params.append("maxPrice", values.maxPrice.toString());
  if (values.colorId) params.append("colorId", values.colorId.toString());
  if (values.categoryIds?.length)
    params.append("categoryIds", values.categoryIds.join(","));
  if (values.typeId) params.append("typeId", values.typeId.toString());
  if (pageable.sort) params.append("sort", pageable.sort);
  if (pageable.page) params.append("page", pageable.page);
  if (pageable.size) params.append("size", pageable.size);

  const response = await interceptorApiClient.get(
    `/public/products/filter?${params.toString()}`
  );
  return response.data;
};

export const getSearchedProducts = async (
  searchTerm: string,
  pageable: IPageableFilter
): Promise<IPage<IProduct>> => {
  const params = new URLSearchParams();

  if (searchTerm) params.append("search", searchTerm);
  if (pageable.sort) params.append("sort", pageable.sort);
  if (pageable.page) params.append("page", pageable.page);
  if (pageable.size) params.append("size", pageable.size);

  const response = await interceptorApiClient.get(
    `/public/products/search?${params.toString()}`
  );
  return response.data;
};
