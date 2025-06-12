import { useShallow } from "zustand/react/shallow";
import {
  getAllPurchaseOrderDetails,
  getPurchaseOrderDetailById,
  createPurchaseOrderDetail,
  updatePurchaseOrderDetail,
  deletePurchaseOrderDetail,
} from "../api/services/PurchaseOrderDetailService";
import { IPurchaseOrderDetail } from "../types/PurchaseOrderDetail/IPurchaseOrderDetail";
import {
  ICreatePurchaseOrderDetail,
  IUpdatePurchaseOrderDetail,
} from "../types/PurchaseOrderDetail/IPurchaseOrderDetail";
import { usePurchaseOrderDetailStore } from "../stores/purchaseOrderDetailStore";

interface UsePurchaseOrderDetailsReturn {
  purchaseOrderDetails: IPurchaseOrderDetail[];
  selectedPurchaseOrderDetail: IPurchaseOrderDetail | null;

  fetchPurchaseOrderDetails: () => Promise<void>;
  fetchPurchaseOrderDetailById: (
    id: number
  ) => Promise<IPurchaseOrderDetail | null>;
  handleCreatePurchaseOrderDetail: (
    detail: IPurchaseOrderDetail
  ) => Promise<ICreatePurchaseOrderDetail | null>;
  handleUpdatePurchaseOrderDetail: (
    id: number,
    detail: IPurchaseOrderDetail
  ) => Promise<IUpdatePurchaseOrderDetail | null>;
  handleDeletePurchaseOrderDetail: (id: number) => Promise<boolean>;

  setSelectedPurchaseOrderDetail: (detail: IPurchaseOrderDetail | null) => void;
  refreshPurchaseOrderDetails: () => Promise<void>;
  clearPurchaseOrderDetails: () => void;

  getPurchaseOrderDetailFromStore: (
    id: number
  ) => IPurchaseOrderDetail | undefined;
  resetStore: () => void;
}

export const usePurchaseOrderDetails = (): UsePurchaseOrderDetailsReturn => {
  const {
    purchaseOrderDetails,
    selectedPurchaseOrderDetail,
    setPurchaseOrderDetails,
    addPurchaseOrderDetailToStore,
    updatePurchaseOrderDetailInStore,
    removePurchaseOrderDetailFromStore,
    setSelectedPurchaseOrderDetail,
    clearPurchaseOrderDetails,
    getPurchaseOrderDetailById: getPurchaseOrderDetailFromStore,
    resetStore,
  } = usePurchaseOrderDetailStore(
    useShallow((state) => ({
      purchaseOrderDetails: state.purchaseOrderDetails,
      selectedPurchaseOrderDetail: state.selectedPurchaseOrderDetail,
      setPurchaseOrderDetails: state.setPurchaseOrderDetails,
      addPurchaseOrderDetailToStore: state.addPurchaseOrderDetailToStore,
      updatePurchaseOrderDetailInStore: state.updatePurchaseOrderDetailInStore,
      removePurchaseOrderDetailFromStore:
        state.removePurchaseOrderDetailFromStore,
      setSelectedPurchaseOrderDetail: state.setSelectedPurchaseOrderDetail,
      clearPurchaseOrderDetails: state.clearPurchaseOrderDetails,
      getPurchaseOrderDetailById: state.getPurchaseOrderDetailById,
      resetStore: state.resetStore,
    }))
  );

  const fetchPurchaseOrderDetails = async () => {
    try {
      const data = await getAllPurchaseOrderDetails();
      setPurchaseOrderDetails(data);
    } catch (error) {
      console.error("Error fetching Purchase Order Details:", error);
    }
  };

  const fetchPurchaseOrderDetailById = async (id: number) => {
    try {
      const detail = await getPurchaseOrderDetailById(id);
      setSelectedPurchaseOrderDetail(detail);
      return detail;
    } catch (error) {
      console.error("Error fetching Purchase Order Detail by ID:", error);
      return null;
    }
  };

  const handleCreatePurchaseOrderDetail = async (
    detail: IPurchaseOrderDetail
  ) => {
    try {
      const newDetail = await createPurchaseOrderDetail(detail);
      if (newDetail && "id" in newDetail) {
        addPurchaseOrderDetailToStore(newDetail as IPurchaseOrderDetail);
      }
      return newDetail;
    } catch (error) {
      console.error("Error creating Purchase Order Detail:", error);
      return null;
    }
  };

  const handleUpdatePurchaseOrderDetail = async (
    id: number,
    detail: IPurchaseOrderDetail
  ) => {
    try {
      const updatedDetail = await updatePurchaseOrderDetail(id, detail);
      if (updatedDetail && "id" in updatedDetail) {
        updatePurchaseOrderDetailInStore(
          id,
          updatedDetail as IPurchaseOrderDetail
        );
      }
      return updatedDetail;
    } catch (error) {
      console.error("Error updating Purchase Order Detail:", error);
      return null;
    }
  };

  const handleDeletePurchaseOrderDetail = async (id: number) => {
    try {
      await deletePurchaseOrderDetail(id);
      removePurchaseOrderDetailFromStore(id);
      return true;
    } catch (error) {
      console.error("Error deleting Purchase Order Detail:", error);
      return false;
    }
  };

  const refreshPurchaseOrderDetails = async () =>
    await fetchPurchaseOrderDetails();

  return {
    purchaseOrderDetails,
    selectedPurchaseOrderDetail,

    fetchPurchaseOrderDetails,
    fetchPurchaseOrderDetailById,
    handleCreatePurchaseOrderDetail,
    handleUpdatePurchaseOrderDetail,
    handleDeletePurchaseOrderDetail,

    setSelectedPurchaseOrderDetail,
    refreshPurchaseOrderDetails,
    clearPurchaseOrderDetails,

    getPurchaseOrderDetailFromStore,
    resetStore,
  };
};
