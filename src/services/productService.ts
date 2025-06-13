import { Product } from "../types/Product/Product";


const API_URL = import.meta.env.VITE_API_URL + "/admin/products";

export async function getProducts(): Promise<Product[]> {
  const resp = await fetch(API_URL);
  if (!resp.ok) throw new Error("Error al obtener productos");
  return resp.json();
}

export async function getProductById(id: number): Promise<Product> {
  const resp = await fetch(`${API_URL}/${id}`);
  if (!resp.ok) throw new Error("Producto no encontrado");
  return resp.json();
}

export async function createProduct(product: Partial<Product>) {
  const resp = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!resp.ok) throw new Error("Error al crear producto");
  return resp.json();
}

export async function updateProduct(id: number, product: Partial<Product>) {
  const resp = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!resp.ok) throw new Error("Error al actualizar producto");
  return resp.json();
}

export async function deleteProduct(id: number) {
  const resp = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!resp.ok) throw new Error("Error al eliminar producto");
  return resp.json();
}
