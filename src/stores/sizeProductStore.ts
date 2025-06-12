import { create } from "zustand";
import { ISizeProduct } from "../types/SizeProduct/ISizeProduct";

interface SizeProductState {
  sizeProducts: ISizeProduct[];
  selectedSizeProduct: ISizeProduct | null;

  setSizeProducts: (sizeProducts: ISizeProduct[]) => void;
  addSizeProduct: (sizeProduct: ISizeProduct) => void;
  updateSizeProduct: (id: number, updated: ISizeProduct) => void;
  removeSizeProduct: (id: number) => void;
  setSelectedSizeProduct: (sizeProduct: ISizeProduct | null) => void;
  clearSizeProducts: () => void;
  getSizeProductById: (id: number) => ISizeProduct | undefined;
  resetStore: () => void;
}

const initialState = {
  sizeProducts: [],
  selectedSizeProduct: null,
};

export const useSizeProductStore = create<SizeProductState>((set, get) => ({
  ...initialState,

  setSizeProducts: (sizeProducts) => set({ sizeProducts }),
  addSizeProduct: (sizeProduct) =>
    set((state) => ({ sizeProducts: [...state.sizeProducts, sizeProduct] })),
  updateSizeProduct: (id, updated) =>
    set((state) => ({
      sizeProducts: state.sizeProducts.map((sp) =>
        sp.id === id ? updated : sp
      ),
      selectedSizeProduct:
        state.selectedSizeProduct?.id === id
          ? updated
          : state.selectedSizeProduct,
    })),
  removeSizeProduct: (id) =>
    set((state) => ({
      sizeProducts: state.sizeProducts.filter((sp) => sp.id !== id),
      selectedSizeProduct:
        state.selectedSizeProduct?.id === id ? null : state.selectedSizeProduct,
    })),
  setSelectedSizeProduct: (sizeProduct) =>
    set({ selectedSizeProduct: sizeProduct }),
  clearSizeProducts: () => set(initialState),
  getSizeProductById: (id) => get().sizeProducts.find((sp) => sp.id === id),
  resetStore: () => set(initialState),
}));
