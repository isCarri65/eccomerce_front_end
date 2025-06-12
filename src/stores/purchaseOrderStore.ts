import { create } from "zustand";
import { IPurchaseOrder } from "../types/PurchaseOrder/IPurcharseOrder";

interface PurchaseOrderState {
  purchaseOrders: IPurchaseOrder[];
  selectedPurchaseOrder: IPurchaseOrder | null;

  setPurchaseOrders: (purchaseOrders: IPurchaseOrder[]) => void;
  addPurchaseOrderToStore: (purchaseOrder: IPurchaseOrder) => void;
  updatePurchaseOrderInStore: (id: number, updated: IPurchaseOrder) => void;
  removePurchaseOrderFromStore: (id: number) => void;

  setSelectedPurchaseOrder: (purchaseOrder: IPurchaseOrder | null) => void;
  clearPurchaseOrders: () => void;
  getPurchaseOrderById: (id: number) => IPurchaseOrder | undefined;
  resetStore: () => void;
}

const initialState = {
  purchaseOrders: [],
  selectedPurchaseOrder: null,
};

export const usePurchaseOrderStore = create<PurchaseOrderState>((set, get) => ({
  ...initialState,

  setPurchaseOrders: (purchaseOrders) => set({ purchaseOrders }),

  addPurchaseOrderToStore: (purchaseOrder) =>
    set((state) => ({
      purchaseOrders: [...state.purchaseOrders, purchaseOrder],
    })),

  updatePurchaseOrderInStore: (id, updated) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id ? updated : po
      ),
      selectedPurchaseOrder:
        state.selectedPurchaseOrder?.id === id
          ? updated
          : state.selectedPurchaseOrder,
    })),

  removePurchaseOrderFromStore: (id) =>
    set((state) => ({
      purchaseOrders: state.purchaseOrders.filter((po) => po.id !== id),
      selectedPurchaseOrder:
        state.selectedPurchaseOrder?.id === id
          ? null
          : state.selectedPurchaseOrder,
    })),

  setSelectedPurchaseOrder: (purchaseOrder) =>
    set({ selectedPurchaseOrder: purchaseOrder }),

  clearPurchaseOrders: () =>
    set({
      purchaseOrders: [],
      selectedPurchaseOrder: null,
    }),

  getPurchaseOrderById: (id) => {
    const { purchaseOrders } = get();
    return purchaseOrders.find((po) => po.id === id);
  },

  resetStore: () => set(initialState),
}));
