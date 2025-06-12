import { create } from "zustand";
import { IDiscount } from "../types/Discount/IDiscount";

interface DiscountState {
  // Estado
  discounts: IDiscount[];
  selectedDiscount: IDiscount | null;

  // Acciones para discounts
  setDiscounts: (discounts: IDiscount[]) => void;
  addDiscountToStore: (discount: IDiscount) => void;
  updateDiscountInStore: (id: number, updatedDiscount: IDiscount) => void;
  removeDiscountFromStore: (id: number) => void;

  // Acciones para discount seleccionado
  setSelectedDiscount: (discount: IDiscount | null) => void;

  // Utilidades
  clearDiscounts: () => void;
  getDiscountById: (id: number) => IDiscount | undefined;
  resetStore: () => void;
}

const initialState = {
  discounts: [],
  selectedDiscount: null,
};

export const useDiscountStore = create<DiscountState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de discounts
  setDiscounts: (discounts) => set({ discounts }),

  // Agregar un nuevo discount
  addDiscountToStore: (discount) =>
    set((state) => ({
      discounts: [...state.discounts, discount],
    })),

  // Actualizar un discount existente
  updateDiscountInStore: (id, updatedDiscount) =>
    set((state) => ({
      discounts: state.discounts.map((discount) =>
        discount.id === id ? updatedDiscount : discount
      ),
      selectedDiscount:
        state.selectedDiscount?.id === id
          ? updatedDiscount
          : state.selectedDiscount,
    })),

  // Remover un discount por ID
  removeDiscountFromStore: (id) =>
    set((state) => ({
      discounts: state.discounts.filter((discount) => discount.id !== id),
      selectedDiscount:
        state.selectedDiscount?.id === id ? null : state.selectedDiscount,
    })),

  // Establecer discount seleccionado
  setSelectedDiscount: (discount) => set({ selectedDiscount: discount }),

  // Limpiar discounts
  clearDiscounts: () =>
    set({
      discounts: [],
      selectedDiscount: null,
    }),

  // Buscar discount por ID en el store local
  getDiscountById: (id) => {
    const { discounts } = get();
    return discounts.find((discount) => discount.id === id);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
