import { useShallow } from "zustand/react/shallow";
import {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "../api/services/DiscountService";
import { IDiscount } from "../types/Discount/IDiscount";
import { ICreateDiscount, IUpdateDiscount } from "../types/Discount/IDiscount"; // Asumiendo que existen estos tipos
import { useDiscountStore } from "../stores/discountStore";

// Hook principal para Discounts
interface UseDiscountsReturn {
  // State from Zustand
  discounts: IDiscount[];
  selectedDiscount: IDiscount | null;

  // CRUD Operations
  fetchDiscounts: () => Promise<void>;
  fetchDiscountById: (id: number) => Promise<IDiscount | null>;
  handleCreateDiscount: (
    discount: IDiscount
  ) => Promise<ICreateDiscount | null>;
  handleUpdateDiscount: (
    id: number,
    discount: IDiscount
  ) => Promise<IUpdateDiscount | null>;
  handleDeleteDiscount: (id: number) => Promise<boolean>;

  // State Management
  setSelectedDiscount: (discount: IDiscount | null) => void;
  refreshDiscounts: () => Promise<void>;
  clearDiscounts: () => void;

  // Utility functions
  getDiscountFromStore: (id: number) => IDiscount | undefined;
  resetStore: () => void;
}

export const useDiscounts = (): UseDiscountsReturn => {
  const {
    discounts,
    selectedDiscount,
    setDiscounts,
    addDiscountToStore,
    updateDiscountInStore,
    removeDiscountFromStore,
    setSelectedDiscount,
    clearDiscounts,
    getDiscountById: getDiscountFromStore,
    resetStore,
  } = useDiscountStore(
    useShallow((state) => ({
      discounts: state.discounts,
      selectedDiscount: state.selectedDiscount,
      setDiscounts: state.setDiscounts,
      addDiscountToStore: state.addDiscountToStore,
      updateDiscountInStore: state.updateDiscountInStore,
      removeDiscountFromStore: state.removeDiscountFromStore,
      setSelectedDiscount: state.setSelectedDiscount,
      clearDiscounts: state.clearDiscounts,
      getDiscountById: state.getDiscountById,
      resetStore: state.resetStore,
    }))
  );

  // Obtener todos los discounts
  const fetchDiscounts = async (): Promise<void> => {
    try {
      const discountsData = await getAllDiscounts();
      setDiscounts(discountsData);
    } catch (error) {
      console.log("Error al obtener discounts:", error);
    }
  };

  // Obtener discount por ID
  const fetchDiscountById = async (id: number): Promise<IDiscount | null> => {
    try {
      const discount = await getDiscountById(id);
      setSelectedDiscount(discount);
      return discount;
    } catch (error) {
      console.log("Error al obtener discount por ID:", error);
      return null;
    }
  };

  // Crear discount
  const handleCreateDiscount = async (
    discount: IDiscount
  ): Promise<ICreateDiscount | null> => {
    try {
      const newDiscount = await createDiscount(discount);
      // Asumiendo que la respuesta incluye el discount creado
      if (newDiscount && "id" in newDiscount) {
        addDiscountToStore(newDiscount as IDiscount);
      }
      return newDiscount;
    } catch (error) {
      console.log("Error al crear discount:", error);
      return null;
    }
  };

  // Actualizar discount
  const handleUpdateDiscount = async (
    id: number,
    discount: IDiscount
  ): Promise<IUpdateDiscount | null> => {
    try {
      const updatedDiscount = await updateDiscount(id, discount);
      // Asumiendo que la respuesta incluye el discount actualizado
      if (updatedDiscount && "id" in updatedDiscount) {
        updateDiscountInStore(id, updatedDiscount as IDiscount);
      }
      return updatedDiscount;
    } catch (error) {
      console.log("Error al actualizar discount:", error);
      return null;
    }
  };

  // Eliminar discount
  const handleDeleteDiscount = async (id: number): Promise<boolean> => {
    try {
      await deleteDiscount(id);
      removeDiscountFromStore(id);
      return true;
    } catch (error) {
      console.log("Error al eliminar discount:", error);
      return false;
    }
  };

  // Refrescar discounts
  const refreshDiscounts = async (): Promise<void> => {
    await fetchDiscounts();
  };

  return {
    // State from Zustand
    discounts,
    selectedDiscount,

    // CRUD Operations
    fetchDiscounts,
    fetchDiscountById,
    handleCreateDiscount,
    handleUpdateDiscount,
    handleDeleteDiscount,

    // State Management
    setSelectedDiscount,
    refreshDiscounts,
    clearDiscounts,

    // Utility functions
    getDiscountFromStore,
    resetStore,
  };
};
