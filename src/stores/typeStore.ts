import { create } from "zustand";
import { IType } from "../types/Type/IType";

interface TypeState {
  // Estado
  types: IType[];
  selectedType: IType | null;
  loading: boolean;
  error: string | null;

  // Acciones para tipos
  setTypes: (types: IType[]) => void;
  addType: (type: IType) => void;
  updateTypeInStore: (id: number, updatedType: IType) => void;
  removeTypeFromStore: (id: number) => void;

  // Acciones para tipo seleccionado
  setSelectedType: (type: IType | null) => void;

  // Acciones para loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilidades
  clearTypes: () => void;
  getTypeById: (id: number) => IType | undefined;
  resetStore: () => void;
}

const initialState = {
  types: [],
  selectedType: null,
  loading: false,
  error: null,
};

export const useTypeStore = create<TypeState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de tipos
  setTypes: (types) => set({ types, error: null }),

  // Agregar un nuevo tipo
  addType: (type) =>
    set((state) => ({
      types: [...state.types, type],
      error: null,
    })),

  // Actualizar un tipo existente
  updateTypeInStore: (id, updatedType) =>
    set((state) => ({
      types: state.types.map((type) => (type.id === id ? updatedType : type)),
      selectedType:
        state.selectedType?.id === id ? updatedType : state.selectedType,
      error: null,
    })),

  // Eliminar un tipo
  removeTypeFromStore: (id) =>
    set((state) => ({
      types: state.types.filter((type) => type.id !== id),
      selectedType: state.selectedType?.id === id ? null : state.selectedType,
      error: null,
    })),

  // Establecer tipo seleccionado
  setSelectedType: (type) => set({ selectedType: type }),

  // Establecer estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar lista de tipos
  clearTypes: () => set({ types: [], selectedType: null, error: null }),

  // Buscar tipo por ID en el store local
  getTypeById: (id) => {
    const { types } = get();
    return types.find((type) => type.id === id);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
