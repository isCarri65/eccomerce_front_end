import { create } from "zustand";
import { IProductDiscount } from "../types/ProductDiscount/IProductDiscount";

interface ProductDiscountState {
  productDiscounts: IProductDiscount[];
  selectedProductDiscount: IProductDiscount | null;

  setProductDiscounts: (productDiscounts: IProductDiscount[]) => void;
  addProductDiscount: (productDiscount: IProductDiscount) => void;
  updateProductDiscount: (id: number, updated: IProductDiscount) => void;
  removeProductDiscount: (id: number) => void;
  setSelectedProductDiscount: (
    productDiscount: IProductDiscount | null
  ) => void;
  clearProductDiscounts: () => void;
  getProductDiscountById: (id: number) => IProductDiscount | undefined;
  resetStore: () => void;
}

const initialState = {
  productDiscounts: [],
  selectedProductDiscount: null,
};

export const useProductDiscountStore = create<ProductDiscountState>(
  (set, get) => ({
    ...initialState,

    setProductDiscounts: (productDiscounts) => set({ productDiscounts }),
    addProductDiscount: (productDiscount) =>
      set((state) => ({
        productDiscounts: [...state.productDiscounts, productDiscount],
      })),
    updateProductDiscount: (id, updated) =>
      set((state) => ({
        productDiscounts: state.productDiscounts.map((pd) =>
          pd.id === id ? updated : pd
        ),
        selectedProductDiscount:
          state.selectedProductDiscount?.id === id
            ? updated
            : state.selectedProductDiscount,
      })),
    removeProductDiscount: (id) =>
      set((state) => ({
        productDiscounts: state.productDiscounts.filter((pd) => pd.id !== id),
        selectedProductDiscount:
          state.selectedProductDiscount?.id === id
            ? null
            : state.selectedProductDiscount,
      })),
    setSelectedProductDiscount: (productDiscount) =>
      set({ selectedProductDiscount: productDiscount }),
    clearProductDiscounts: () => set(initialState),
    getProductDiscountById: (id) =>
      get().productDiscounts.find((pd) => pd.id === id),
    resetStore: () => set(initialState),
  })
);
