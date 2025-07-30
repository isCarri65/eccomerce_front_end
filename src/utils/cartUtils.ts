// utils/cartUtils.ts
export interface CartItem {
  productVariantId: number;
  quantity?: number;
}

const STORAGE_KEY = "cart";

export function addToCart(item: CartItem) {
  let current: CartItem[] = [];

  try {
    current = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
  } catch (e) {
    current = [];
  }

  // Buscar si el ítem ya existe por productVariantId
  const existingIndex = current.findIndex(
    (i) => i.productVariantId === item.productVariantId
  );

  if (existingIndex !== -1) {
    // Si ya existe, incrementar quantity
    current[existingIndex].quantity =
      (current[existingIndex].quantity || 1) + (item.quantity ?? 1);
  } else {
    // Si no existe, agregarlo con quantity (o 1 si no viene)
    const newItem = {
      ...item,
      quantity: item.quantity ?? 1,
    };
    console.log("Adding item to cart:", newItem);
    current.push(newItem);
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}
