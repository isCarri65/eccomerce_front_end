import { useShallow } from "zustand/react/shallow";
import {
  getAllSizes,
  getSizeById,
  createSize,
  updateSize,
  deleteSize,
} from "../api/services/SizeService";
import { ISize } from "../types/Size/ISize";
import { useSizeStore } from "../stores/sizeStore";

interface UseSizesReturn {
  sizes: ISize[];
  selectedSize: ISize | null;

  fetchSizes: () => Promise<void>;
  fetchSizeById: (id: number) => Promise<ISize | null>;
  handleCreateSize: (size: ISize) => Promise<ISize | null>;
  handleUpdateSize: (id: number, size: ISize) => Promise<ISize | null>;
  handleDeleteSize: (id: number) => Promise<boolean>;

  setSelectedSize: (size: ISize | null) => void;
  clearSizes: () => void;

  getSizeFromStore: (id: number) => ISize | undefined;
  resetStore: () => void;
}

export const useSizes = (): UseSizesReturn => {
  const {
    sizes,
    selectedSize,
    setSizes,
    addSizeToStore,
    updateSizeInStore,
    removeSizeFromStore,
    setSelectedSize,
    clearSizes,
    getSizeById: getSizeFromStore,
    resetStore,
  } = useSizeStore(
    useShallow((state) => ({
      sizes: state.sizes,
      selectedSize: state.selectedSize,
      setSizes: state.setSizes,
      addSizeToStore: state.addSize,
      updateSizeInStore: state.updateSize,
      removeSizeFromStore: state.removeSize,
      setSelectedSize: state.setSelectedSize,
      clearSizes: state.clearSizes,
      getSizeById: state.getSizeById,
      resetStore: state.resetStore,
    }))
  );

  const fetchSizes = async () => {
    try {
      const data = await getAllSizes();
      setSizes(data);
    } catch (error) {
      console.error("Error fetching Sizes:", error);
    }
  };

  const fetchSizeById = async (id: number) => {
    try {
      const size = await getSizeById(id);
      setSelectedSize(size);
      return size;
    } catch (error) {
      console.error("Error fetching Size by ID:", error);
      return null;
    }
  };

  const handleCreateSize = async (size: ISize) => {
    try {
      const newSize = await createSize(size);
      if (newSize && "id" in newSize) {
        addSizeToStore(newSize as ISize);
      }
      return newSize;
    } catch (error) {
      console.error("Error creating Size:", error);
      return null;
    }
  };

  const handleUpdateSize = async (id: number, size: ISize) => {
    try {
      const updatedSize = await updateSize(id, size);
      if (updatedSize && "id" in updatedSize) {
        updateSizeInStore(id, updatedSize as ISize);
      }
      return updatedSize;
    } catch (error) {
      console.error("Error updating Size:", error);
      return null;
    }
  };

  const handleDeleteSize = async (id: number) => {
    try {
      await deleteSize(id);
      removeSizeFromStore(id);
      return true;
    } catch (error) {
      console.error("Error deleting Size:", error);
      return false;
    }
  };

  return {
    sizes,
    selectedSize,

    fetchSizes,
    fetchSizeById,
    handleCreateSize,
    handleUpdateSize,
    handleDeleteSize,

    setSelectedSize,
    clearSizes,

    getSizeFromStore,
    resetStore,
  };
};
