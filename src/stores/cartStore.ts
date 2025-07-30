import { create } from "zustand";
import { IProductVariantCART } from "../types/Product/IProductVariantCART";

interface ICartStore {
  itemsChecked: IProductVariantCART[];
  setItemsChecked: (items: IProductVariantCART[]) => void;
  resetStore: () => void;
}

const intialValues = {
  itemsChecked: [],
};

export const cartStore = create<ICartStore>((set) => ({
  ...intialValues,
  setItemsChecked: (items) => set(() => ({ itemsChecked: items })),

  resetStore: () => set(() => intialValues),
}));
