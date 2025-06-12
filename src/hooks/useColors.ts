import { useShallow } from "zustand/react/shallow";
import {
  getAllColors,
  getColorById,
  createColor,
  updateColor,
  deleteColor,
} from "../api/services/ColorService";
import { IColor } from "../types/Color/IColor";
import { useColorStore } from "../stores/colorStore";

// Hook principal para Colors
interface UseColorsReturn {
  // State from Zustand
  colors: IColor[];
  selectedColor: IColor | null;
  loading: boolean;
  error: string | null;

  // CRUD Operations
  fetchColors: () => Promise<void>;
  fetchColorById: (id: number) => Promise<IColor | null>;
  handleCreateColor: (color: IColor) => Promise<ICreateColor | null>;
  handleUpdateColor: (
    id: number,
    color: IColor
  ) => Promise<IUpdateColor | null>;
  handleDeleteColor: (id: number) => Promise<boolean>;

  // State Management
  setSelectedColor: (color: IColor | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshColors: () => Promise<void>;
  clearColors: () => void;

  // Utility functions
  getColorFromStore: (id: number) => IColor | undefined;
  resetStore: () => void;
}

export const useColors = (): UseColorsReturn => {
  const {
    colors,
    selectedColor,
    loading,
    error,
    setColors,
    addColorToStore,
    updateColorInStore,
    removeColorFromStore,
    setSelectedColor,
    setLoading,
    setError,
    clearColors,
    getColorById: getColorFromStore,
    resetStore,
  } = useColorStore(
    useShallow((state) => ({
      colors: state.colors,
      selectedColor: state.selectedColor,
      loading: state.loading,
      error: state.error,
      setColors: state.setColors,
      addColorToStore: state.addColorToStore,
      updateColorInStore: state.updateColorInStore,
      removeColorFromStore: state.removeColorFromStore,
      setSelectedColor: state.setSelectedColor,
      setLoading: state.setLoading,
      setError: state.setError,
      clearColors: state.clearColors,
      getColorById: state.getColorById,
      resetStore: state.resetStore,
    }))
  );

  // Obtener todos los colors
  const fetchColors = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const colorsData = await getAllColors();
      setColors(colorsData);
    } catch (error) {
      const errorMessage = "Error al obtener colors";
      console.log(errorMessage, error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener color por ID
  const fetchColorById = async (id: number): Promise<IColor | null> => {
    setLoading(true);
    setError(null);
    try {
      const color = await getColorById(id);
      setSelectedColor(color);
      return color;
    } catch (error) {
      const errorMessage = "Error al obtener color por ID";
      console.log(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear color
  const handleCreateColor = async (
    color: IColor
  ): Promise<ICreateColor | null> => {
    setLoading(true);
    setError(null);
    try {
      const newColor = await createColor(color);
      // Asumiendo que la respuesta incluye el color creado
      if (newColor && "id" in newColor) {
        addColorToStore(newColor as IColor);
      }
      return newColor;
    } catch (error) {
      const errorMessage = "Error al crear color";
      console.log(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar color
  const handleUpdateColor = async (
    id: number,
    color: IColor
  ): Promise<IUpdateColor | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedColor = await updateColor(id, color);
      // Asumiendo que la respuesta incluye el color actualizado
      if (updatedColor && "id" in updatedColor) {
        updateColorInStore(id, updatedColor as IColor);
      }
      return updatedColor;
    } catch (error) {
      const errorMessage = "Error al actualizar color";
      console.log(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar color
  const handleDeleteColor = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteColor(id);
      removeColorFromStore(id);
      return true;
    } catch (error) {
      const errorMessage = "Error al eliminar color";
      console.log(errorMessage, error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar colors
  const refreshColors = async (): Promise<void> => {
    await fetchColors();
  };

  return {
    // State from Zustand
    colors,
    selectedColor,
    loading,
    error,

    // CRUD Operations
    fetchColors,
    fetchColorById,
    handleCreateColor,
    handleUpdateColor,
    handleDeleteColor,

    // State Management
    setSelectedColor,
    setLoading,
    setError,
    refreshColors,
    clearColors,

    // Utility functions
    getColorFromStore,
    resetStore,
  };
};
