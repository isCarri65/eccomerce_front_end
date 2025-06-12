import { useShallow } from "zustand/react/shallow";
import {
  getAllTypes,
  getTypeById,
  createType,
  updateType,
  deleteType,
} from "../api/services/TypeService";
import { IType } from "../types/Type/IType";
import { useTypeStore } from "../stores/typeStore";

// Hook principal para Types
interface UseTypesReturn {
  // State from Zustand
  types: IType[];
  selectedType: IType | null;

  // CRUD Operations
  fetchTypes: () => Promise<void>;
  fetchTypeById: (id: number) => Promise<IType | null>;
  handleCreateType: (data: IType) => Promise<boolean>;
  handleUpdateType: (id: number, data: IType) => Promise<boolean>;
  handleDeleteType: (id: number) => Promise<boolean>;

  // State Management
  setSelectedType: (type: IType | null) => void;
  refreshTypes: () => Promise<void>;
  clearTypes: () => void;
}

export const useTypes = (): UseTypesReturn => {
  const {
    types,
    selectedType,
    setTypes,
    addType,
    updateTypeInStore,
    removeTypeFromStore,
    setSelectedType,
    clearTypes,
  } = useTypeStore(
    useShallow((state) => ({
      types: state.types,
      selectedType: state.selectedType,
      setTypes: state.setTypes,
      addType: state.addType,
      updateTypeInStore: state.updateTypeInStore,
      removeTypeFromStore: state.removeTypeFromStore,
      setSelectedType: state.setSelectedType,
      clearTypes: state.clearTypes,
    }))
  );

  // Obtener todos los tipos
  const fetchTypes = async (): Promise<void> => {
    try {
      const typesData = await getAllTypes();
      setTypes(typesData);
    } catch (error) {
      console.log("Error al obtener tipos:", error);
    }
  };

  // Obtener tipo por ID
  const fetchTypeById = async (id: number): Promise<IType | null> => {
    try {
      const type = await getTypeById(id);
      setSelectedType(type);
      return type;
    } catch (error) {
      console.log("Error al obtener tipo por ID:", error);
      return null;
    }
  };

  // Crear tipo
  const handleCreateType = async (data: IType): Promise<boolean> => {
    try {
      const newType = await createType(data);
      addType(newType);
      return true;
    } catch (error) {
      console.log("Error al crear tipo:", error);
      return false;
    }
  };

  // Actualizar tipo
  const handleUpdateType = async (
    id: number,
    data: IType
  ): Promise<boolean> => {
    try {
      const updatedType = await updateType(id, data);
      updateTypeInStore(id, updatedType);
      return true;
    } catch (error) {
      console.log("Error al actualizar tipo:", error);
      return false;
    }
  };

  // Eliminar tipo
  const handleDeleteType = async (id: number): Promise<boolean> => {
    try {
      await deleteType(id);
      removeTypeFromStore(id);
      return true;
    } catch (error) {
      console.log("Error al eliminar tipo:", error);
      return false;
    }
  };

  // Refrescar tipos
  const refreshTypes = async (): Promise<void> => {
    await fetchTypes();
  };

  return {
    // State from Zustand
    types,
    selectedType,

    // Actions
    fetchTypes,
    fetchTypeById,
    handleCreateType,
    handleUpdateType,
    handleDeleteType,
    setSelectedType,
    refreshTypes,
    clearTypes,
  };
};
