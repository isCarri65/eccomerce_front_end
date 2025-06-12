import { create } from "zustand";
import { ICategory } from "../types/Category/ICategory";

// Zustand Store para Categories
interface CategoryStore {
  categories: ICategory[];
  selectedCategory: ICategory | null;

  // Actions
  setCategories: (categories: ICategory[]) => void;
  addCategory: (category: ICategory) => void;
  updateCategoryInStore: (
    id: number,
    updatedCategory: Partial<ICategory>
  ) => void;
  removeCategoryFromStore: (id: number) => void;
  setSelectedCategory: (category: ICategory | null) => void;
  clearCategories: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  selectedCategory: null,

  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, category],
    })),

  updateCategoryInStore: (id, updatedCategory) =>
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updatedCategory } : cat
      ),
      selectedCategory:
        state.selectedCategory?.id === id
          ? { ...state.selectedCategory, ...updatedCategory }
          : state.selectedCategory,
    })),

  removeCategoryFromStore: (id) =>
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      selectedCategory:
        state.selectedCategory?.id === id ? null : state.selectedCategory,
    })),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  clearCategories: () => set({ categories: [], selectedCategory: null }),
}));
