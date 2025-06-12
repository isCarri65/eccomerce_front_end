import { useShallow } from "zustand/react/shallow";
import {
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getAllPurchaseOrdersByUserProfile,
} from "../api/services/PurcharseOrderService";
import { IPurchaseOrder } from "../types/PurchaseOrder/IPurcharseOrder";
import {
  ICreatePurchaseOrder,
  IUpdatePurchaseOrder,
} from "../types/PurchaseOrder/IPurcharseOrder";
import { usePurchaseOrderStore } from "../stores/purchaseOrderStore";

interface UsePurchaseOrdersReturn {
  purchaseOrders: IPurchaseOrder[];
  selectedPurchaseOrder: IPurchaseOrder | null;

  fetchPurchaseOrders: () => Promise<void>;
  fetchPurchaseOrdersByUserProfile: () => Promise<void>;
  fetchPurchaseOrderById: (id: number) => Promise<IPurchaseOrder | null>;
  handleCreatePurchaseOrder: (
    purchaseOrder: IPurchaseOrder
  ) => Promise<ICreatePurchaseOrder | null>;
  handleUpdatePurchaseOrder: (
    id: number,
    purchaseOrder: IPurchaseOrder
  ) => Promise<IUpdatePurchaseOrder | null>;
  handleDeletePurchaseOrder: (id: number) => Promise<boolean>;

  setSelectedPurchaseOrder: (purchaseOrder: IPurchaseOrder | null) => void;
  refreshPurchaseOrders: () => Promise<void>;
  clearPurchaseOrders: () => void;

  getPurchaseOrderFromStore: (id: number) => IPurchaseOrder | undefined;
  resetStore: () => void;
}

export const usePurchaseOrders = (): UsePurchaseOrdersReturn => {
  const {
    purchaseOrders,
    selectedPurchaseOrder,
    setPurchaseOrders,
    addPurchaseOrderToStore,
    updatePurchaseOrderInStore,
    removePurchaseOrderFromStore,
    setSelectedPurchaseOrder,
    clearPurchaseOrders,
    getPurchaseOrderById: getPurchaseOrderFromStore,
    resetStore,
  } = usePurchaseOrderStore(
    useShallow((state) => ({
      purchaseOrders: state.purchaseOrders,
      selectedPurchaseOrder: state.selectedPurchaseOrder,
      setPurchaseOrders: state.setPurchaseOrders,
      addPurchaseOrderToStore: state.addPurchaseOrderToStore,
      updatePurchaseOrderInStore: state.updatePurchaseOrderInStore,
      removePurchaseOrderFromStore: state.removePurchaseOrderFromStore,
      setSelectedPurchaseOrder: state.setSelectedPurchaseOrder,
      clearPurchaseOrders: state.clearPurchaseOrders,
      getPurchaseOrderById: state.getPurchaseOrderById,
      resetStore: state.resetStore,
    }))
  );

  const fetchPurchaseOrders = async () => {
    try {
      const data = await getAllPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Error fetching Purchase Orders:", error);
    }
  };

  const fetchPurchaseOrdersByUserProfile = async () => {
    try {
      const data = await getAllPurchaseOrdersByUserProfile();
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Error fetching Purchase Orders by user profile:", error);
    }
  };

  const fetchPurchaseOrderById = async (id: number) => {
    try {
      const purchaseOrder = await getPurchaseOrderById(id);
      setSelectedPurchaseOrder(purchaseOrder);
      return purchaseOrder;
    } catch (error) {
      console.error("Error fetching Purchase Order by ID:", error);
      return null;
    }
  };

  const handleCreatePurchaseOrder = async (purchaseOrder: IPurchaseOrder) => {
    try {
      const newPurchaseOrder = await createPurchaseOrder(purchaseOrder);
      if (newPurchaseOrder && "id" in newPurchaseOrder) {
        addPurchaseOrderToStore(newPurchaseOrder as IPurchaseOrder);
      }
      return newPurchaseOrder;
    } catch (error) {
      console.error("Error creating Purchase Order:", error);
      return null;
    }
  };

  const handleUpdatePurchaseOrder = async (
    id: number,
    purchaseOrder: IPurchaseOrder
  ) => {
    try {
      const updatedPurchaseOrder = await updatePurchaseOrder(id, purchaseOrder);
      if (updatedPurchaseOrder && "id" in updatedPurchaseOrder) {
        updatePurchaseOrderInStore(id, updatedPurchaseOrder as IPurchaseOrder);
      }
      return updatedPurchaseOrder;
    } catch (error) {
      console.error("Error updating Purchase Order:", error);
      return null;
    }
  };

  const handleDeletePurchaseOrder = async (id: number) => {
    try {
      await deletePurchaseOrder(id);
      removePurchaseOrderFromStore(id);
      return true;
    } catch (error) {
      console.error("Error deleting Purchase Order:", error);
      return false;
    }
  };

  const refreshPurchaseOrders = async () => await fetchPurchaseOrders();

  return {
    purchaseOrders,
    selectedPurchaseOrder,

    fetchPurchaseOrders,
    fetchPurchaseOrdersByUserProfile,
    fetchPurchaseOrderById,
    handleCreatePurchaseOrder,
    handleUpdatePurchaseOrder,
    handleDeletePurchaseOrder,

    setSelectedPurchaseOrder,
    refreshPurchaseOrders,
    clearPurchaseOrders,

    getPurchaseOrderFromStore,
    resetStore,
  };
};
