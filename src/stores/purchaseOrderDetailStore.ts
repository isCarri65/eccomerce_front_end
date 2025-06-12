import { create } from "zustand";
import { IPurchaseOrderDetail } from "../types/PurchaseOrderDetail/IPurchaseOrderDetail";

interface PurchaseOrderDetailState {
  // State
  purchaseOrderDetails: IPurchaseOrderDetail[];
  selectedPurchaseOrderDetail: IPurchaseOrderDetail | null;

  // Actions
  setPurchaseOrderDetails: (details: IPurchaseOrderDetail[]) => void;
  addPurchaseOrderDetailToStore: (detail: IPurchaseOrderDetail) => void;
  updatePurchaseOrderDetailInStore: (
    id: number,
    updatedDetail: IPurchaseOrderDetail
  ) => void;
  removePurchaseOrderDetailFromStore: (id: number) => void;

  setSelectedPurchaseOrderDetail: (detail: IPurchaseOrderDetail | null) => void;

  clearPurchaseOrderDetails: () => void;
  getPurchaseOrderDetailById: (id: number) => IPurchaseOrderDetail | undefined;
  resetStore: () => void;
}

const initialState = {
  purchaseOrderDetails: [],
  selectedPurchaseOrderDetail: null,
};

export const usePurchaseOrderDetailStore = create<PurchaseOrderDetailState>(
  (set, get) => ({
    ...initialState,

    setPurchaseOrderDetails: (details) =>
      set({ purchaseOrderDetails: details }),

    addPurchaseOrderDetailToStore: (detail) =>
      set((state) => ({
        purchaseOrderDetails: [...state.purchaseOrderDetails, detail],
      })),

    updatePurchaseOrderDetailInStore: (id, updatedDetail) =>
      set((state) => ({
        purchaseOrderDetails: state.purchaseOrderDetails.map((detail) =>
          detail.id === id ? updatedDetail : detail
        ),
        selectedPurchaseOrderDetail:
          state.selectedPurchaseOrderDetail?.id === id
            ? updatedDetail
            : state.selectedPurchaseOrderDetail,
      })),

    removePurchaseOrderDetailFromStore: (id) =>
      set((state) => ({
        purchaseOrderDetails: state.purchaseOrderDetails.filter(
          (detail) => detail.id !== id
        ),
        selectedPurchaseOrderDetail:
          state.selectedPurchaseOrderDetail?.id === id
            ? null
            : state.selectedPurchaseOrderDetail,
      })),

    setSelectedPurchaseOrderDetail: (detail) =>
      set({ selectedPurchaseOrderDetail: detail }),

    clearPurchaseOrderDetails: () =>
      set({
        purchaseOrderDetails: [],
        selectedPurchaseOrderDetail: null,
      }),

    getPurchaseOrderDetailById: (id) => {
      const { purchaseOrderDetails } = get();
      return purchaseOrderDetails.find((detail) => detail.id === id);
    },

    resetStore: () => set(initialState),
  })
);
