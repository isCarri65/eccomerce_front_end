import interceptorApiClient from "../interceptors/axios.interceptorApiClient";
import { Address } from "../../types/Address/IAddress";
import { ICreateAddress } from "../../types/Address/ICreateAddress";
import { IUpdateAddress } from "../../types/Address/IUpdateAddress";

export const getAllAddresses = async (): Promise<Address[]> => {
  const response = await interceptorApiClient.get("/protected/addresses/getAll");
  return response.data;
};

export const getAddressById = async (id: number): Promise<Address> => {
  const response = await interceptorApiClient.get(`/protected/addresses/${id}`);
  return response.data;
};

export const createAddress = async (
  address: ICreateAddress
): Promise<Address> => {
  const response = await interceptorApiClient.post("/protected/addresses/create", address);
  return response.data;
};

export const updateAddress = async (
  id: number,
  address: IUpdateAddress
): Promise<Address> => {
  const response = await interceptorApiClient.put(`/protected/addresses/update-by-id/${id}`, address);
  return response.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await interceptorApiClient.delete(`/api/protected/addresses/${id}`);
  // No return value for delete operation
};
