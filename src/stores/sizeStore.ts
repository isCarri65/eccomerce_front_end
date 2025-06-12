import { create } from "zustand";
import { ISize } from "../types/Size/ISize";

interface SizeState {
  sizes: ISize[];
  selectedSize: ISize | null;

  setSizes: (sizes: ISize[]) => void;
  addSize: (size: ISize) => void;
  updateSize: (id: number, updated: ISize) => void;
  removeSize: (id: number) => void;
  setSelectedSize: (size: ISize | null) => void;
  clearSizes: () => void;
  getSizeById: (id: number) => ISize | undefined;
  resetStore: () => void;
}

const initialState = {
  sizes: [],
  selectedSize: null,
};

export const useSizeStore = create<SizeState>((set, get) => ({
  ...initialState,

  setSizes: (sizes) => set({ sizes }),
  addSize: (size) => set((state) => ({ sizes: [...state.sizes, size] })),
  updateSize: (id, updated) =>
    set((state) => ({
      sizes: state.sizes.map((s) => (s.id === id ? updated : s)),
      selectedSize:
        state.selectedSize?.id === id ? updated : state.selectedSize,
    })),
  removeSize: (id) =>
    set((state) => ({
      sizes: state.sizes.filter((s) => s.id !== id),
      selectedSize: state.selectedSize?.id === id ? null : state.selectedSize,
    })),
  setSelectedSize: (size) => set({ selectedSize: size }),
  clearSizes: () => set(initialState),
  getSizeById: (id) => get().sizes.find((s) => s.id === id),
  resetStore: () => set(initialState),
}));
