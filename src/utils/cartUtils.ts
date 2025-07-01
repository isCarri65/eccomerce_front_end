// utils/cartUtils.ts
export interface CartItem {
  productId: number;
  colorId: number;
  sizeId: number;
}

const STORAGE_KEY = "cart";

export function addToCart(item: CartItem) {
  let current = [];
  try {
    current = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    current = [];
  }
  // Si ya está (igual color, size, producto), no agregamos de nuevo.
  const exists = current.some(
    (i: CartItem) =>
      i.productId === item.productId &&
      i.colorId === item.colorId &&
      i.sizeId === item.sizeId
  );
  if (!exists) {
    current.push(item);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
}
