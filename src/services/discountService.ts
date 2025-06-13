import { IDiscount } from "../types/Promotion/IDiscount";


const API_URL = import.meta.env.VITE_API_URL + "/admin/discounts";

export const getDiscounts = async (): Promise<IDiscount[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Error al obtener los descuentos");
  }
  return response.json();
};

export const createDiscount = async (discount: Omit<IDiscount, "id">): Promise<IDiscount> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discount),
  });
  if (!response.ok) {
    throw new Error("Error al crear el descuento");
  }
  return response.json();
};

export const updateDiscount = async (id: number, discount: Omit<IDiscount, "id">): Promise<IDiscount> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discount),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el descuento");
  }
  return response.json();
};

export const deleteDiscount = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el descuento");
  }
};
