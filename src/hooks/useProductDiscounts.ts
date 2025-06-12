import { useShallow } from "zustand/react/shallow";
import {
  getAllProductDiscounts,
  getProductDiscountById,
  createProductDiscount,
  updateProductDiscount,
  deleteProductDiscount,
} from "../api/services/ProductDiscountService";
import { IProductDiscount } from "../types/ProductDiscount/IProductDiscount";
import { useProductDiscountStore } from "../stores/productDiscountStore";

interface UseProductDiscountsReturn {
  productDiscounts: IProductDiscount[];
  selectedProductDiscount: IProductDiscount | null;

  fetchProductDiscounts: () => Promise<void>;
  fetchProductDiscountById: (id: number) => Promise<IProductDiscount | null>;
  handleCreateProductDiscount: (
    discount: IProductDiscount
  ) => Promise<IProductDiscount | null>;
  handleUpdateProductDiscount: (
    id: number,
    discount: IProductDiscount
  ) => Promise<IProductDiscount | null>;
  handleDeleteProductDiscount: (id: number) => Promise<boolean>;

  setSelectedProductDiscount: (discount: IProductDiscount | null) => void;
  clearProductDiscounts: () => void;

  getProductDiscountFromStore: (id: number) => IProductDiscount | undefined;
  resetStore: () => void;
}

export const useProductDiscounts = (): UseProductDiscountsReturn => {
  const {
    productDiscounts,
    selectedProductDiscount,
    setProductDiscounts,
    addProductDiscountToStore,
    updateProductDiscountInStore,
    removeProductDiscountFromStore,
    setSelectedProductDiscount,
    clearProductDiscounts,
    getProductDiscountById: getProductDiscountFromStore,
    resetStore,
  } = useProductDiscountStore(
    useShallow((state) => ({
      productDiscounts: state.productDiscounts,
      selectedProductDiscount: state.selectedProductDiscount,
      setProductDiscounts: state.setProductDiscounts,
      addProductDiscountToStore: state.addProductDiscount,
      updateProductDiscountInStore: state.updateProductDiscount,
      removeProductDiscountFromStore: state.removeProductDiscount,
      setSelectedProductDiscount: state.setSelectedProductDiscount,
      clearProductDiscounts: state.clearProductDiscounts,
      getProductDiscountById: state.getProductDiscountById,
      resetStore: state.resetStore,
    }))
  );

  const fetchProductDiscounts = async () => {
    try {
      const data = await getAllProductDiscounts();
      setProductDiscounts(data);
    } catch (error) {
      console.error("Error fetching Product Discounts:", error);
    }
  };

  const fetchProductDiscountById = async (id: number) => {
    try {
      const discount = await getProductDiscountById(id);
      setSelectedProductDiscount(discount);
      return discount;
    } catch (error) {
      console.error("Error fetching Product Discount by ID:", error);
      return null;
    }
  };

  const handleCreateProductDiscount = async (discount: IProductDiscount) => {
    try {
      const newDiscount = await createProductDiscount(discount);
      if (newDiscount && "id" in newDiscount) {
        addProductDiscountToStore(newDiscount as IProductDiscount);
      }
      return newDiscount;
    } catch (error) {
      console.error("Error creating Product Discount:", error);
      return null;
    }
  };

  const handleUpdateProductDiscount = async (
    id: number,
    discount: IProductDiscount
  ) => {
    try {
      const updatedDiscount = await updateProductDiscount(id, discount);
      if (updatedDiscount && "id" in updatedDiscount) {
        updateProductDiscountInStore(id, updatedDiscount as IProductDiscount);
      }
      return updatedDiscount;
    } catch (error) {
      console.error("Error updating Product Discount:", error);
      return null;
    }
  };

  const handleDeleteProductDiscount = async (id: number) => {
    try {
      await deleteProductDiscount(id);
      removeProductDiscountFromStore(id);
      return true;
    } catch (error) {
      console.error("Error deleting Product Discount:", error);
      return false;
    }
  };

  return {
    productDiscounts,
    selectedProductDiscount,

    fetchProductDiscounts,
    fetchProductDiscountById,
    handleCreateProductDiscount,
    handleUpdateProductDiscount,
    handleDeleteProductDiscount,

    setSelectedProductDiscount,
    clearProductDiscounts,

    getProductDiscountFromStore,
    resetStore,
  };
};
