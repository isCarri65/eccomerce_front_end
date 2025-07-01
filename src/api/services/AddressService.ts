import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { IAddress } from "../../types/Address/IAddress";
import { ICreateAddress } from "../../types/Address/ICreateAddress";
import { IUpdateAddress } from "../../types/Address/IUpdateAddress";

export const getAllAddresses = async (): Promise<IAddress[]> => {
  const response = await interceptorApiClient.get("/profile/addresses/getAll");
  return response.data;
};

export const getAddressById = async (id: number): Promise<IAddress> => {
  const response = await interceptorApiClient.get(`/addresses/${id}`);
  return response.data;
};

export const createAddress = async (
  address: ICreateAddress
): Promise<IAddress> => {
  const response = await interceptorApiClient.post("/profile/addresses/create", address);
  return response.data;
};

export const updateAddress = async (
  id: number,
  address: IUpdateAddress
): Promise<IAddress> => {
  const response = await interceptorApiClient.put(`/profile/addresses/update/${id}`, address);
  return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/addresses/${id}`);
  // No return value for delete operation
};
