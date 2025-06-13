import { ICategory } from "../types/Category/ICategory";

const API_URL = import.meta.env.VITE_API_URL + "/products";


const getCategories = async (): Promise<ICategory[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error("Error al obtener las categorías");
  }
  return response.json();
};

export { getCategories };

export const createCategory = async (category: Omit<ICategory, "id">): Promise<ICategory> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error("Error al crear la categoría");
  }
  return response.json();
};

export const updateCategory = async (id: number, category: Omit<ICategory, "id">): Promise<ICategory> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar la categoría");
  }
  return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la categoría");
  }
};