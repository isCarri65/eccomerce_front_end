import { create } from "zustand";
import { ProductGenre } from "../types/enums/ProductGenre";
import { ICategory } from "../types/Category/ICategory";
import { IType } from "../types/Type/IType";

export interface IFilterValues {
  categorias: ICategory[];
  genero: ProductGenre | null;
  precio: [number, number];
  orden: "asc" | "desc";
  tipoProducto: IType | null;
}

interface FilterState {
  categorias: ICategory[];
  genero: ProductGenre | null;
  precio: [number, number];
  orden: "asc" | "desc";
  tipoPrenda: string | null;
  setFilters: (filters: Partial<IFilterValues>) => void;
  resetFilters: () => void;
  addCategory: (category: ICategory) => void;
}

export const filterStore = create<FilterState>((set) => ({
  categorias: [],
  genero: null,
  precio: [0, 99999],
  orden: "asc",
  tipoPrenda: null,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  addCategory: (category: ICategory) =>
    set((state) => ({ categorias: [...state.categorias, category] })),
  resetFilters: () =>
    set({
      categorias: [],
      genero: null,
      precio: [0, 99999],
      orden: "asc",
      tipoPrenda: null,
    }),
}));
