import { create } from "zustand";
import { ProductGenre } from "../types/enums/ProductGenre";
import { ICategory } from "../types/Category/ICategory";
import { IType } from "../types/Type/IType";
import { IPageableFilter } from "../types/IPageableFilter";
import { IColor } from "../types/Color/IColor";

export interface IFilterValues {
  categories: ICategory[];
  genre: ProductGenre | null;
  minPrice: number | null;
  maxPrice: number | null;
  type: IType | null;
  color: IColor | null;
}

const initialPageable: IPageableFilter = {
  sort: "recommendedScore,desc",
  page: "0",
  size: "10",
};
const filterValues: IFilterValues = {
  categories: [],
  genre: null,
  minPrice: null,
  maxPrice: null,
  type: null,
  color: null,
};

interface FilterState {
  filters: IFilterValues;
  pageable: IPageableFilter;
  setPageable: (pageable: IPageableFilter) => void;
  setFilters: (filters: Partial<IFilterValues>) => void;
  resetFilters: () => void;
  addCategory: (category: ICategory) => void;
  removeCategory: (categoryId: number) => void;
}

export const filterStore = create<FilterState>((set) => ({
  filters: filterValues,
  pageable: initialPageable,
  setFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  setPageable: (newPageable) => set(() => ({ pageable: newPageable })),
  addCategory: (category: ICategory) =>
    set((state) => ({
      filters: {
        ...state.filters,
        categories: [...state.filters.categories, category],
      },
    })),
  removeCategory: (categoryId: number) =>
    set((state) => ({
      filters: {
        ...state.filters,
        categories: state.filters.categories.filter(
          (cat) => cat.id !== categoryId
        ),
      },
    })),
  resetFilters: () =>
    set(() => ({ filters: filterValues, pageable: initialPageable })),
}));
