import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { Address } from "../../types/Address/IAddress";

export const getAllAddresses = async (): Promise<Address[]> => {
  const response = await interceptorApiClient.get("/addresses");
  return response.data;
};
export const getAddressById = async (id: number): Promise<Address> => {
  const response = await interceptorApiClient.get(`/addresses/${id}`);
  return response.data;
};
export const createAddress = async (
  address: Address
): Promise<ICreateAddress> => {
  const response = await interceptorApiClient.post("/addresses", address);
  return response.data;
};

export const updateAddress = async (
  id: number,
  address: Address
): Promise<IUpdateAddress> => {
  const response = await interceptorApiClient.put(`/addresses/${id}`, address);
  return response.data;
};
export const deleteAddress = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/addresses/${id}`);
  // No return value for delete operation
};
