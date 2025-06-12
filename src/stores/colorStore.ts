import { create } from "zustand";
import { IColor } from "../types/Color/IColor";

interface ColorState {
  // Estado
  colors: IColor[];
  selectedColor: IColor | null;
  loading: boolean;
  error: string | null;

  // Acciones para colors
  setColors: (colors: IColor[]) => void;
  addColorToStore: (color: IColor) => void;
  updateColorInStore: (id: number, updatedColor: IColor) => void;
  removeColorFromStore: (id: number) => void;

  // Acciones para color seleccionado
  setSelectedColor: (color: IColor | null) => void;

  // Acciones para loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilidades
  clearColors: () => void;
  getColorById: (id: number) => IColor | undefined;
  resetStore: () => void;
}

const initialState = {
  colors: [],
  selectedColor: null,
  loading: false,
  error: null,
};

export const useColorStore = create<ColorState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de colors
  setColors: (colors) => set({ colors, error: null }),

  // Agregar un nuevo color
  addColorToStore: (color) =>
    set((state) => ({
      colors: [...state.colors, color],
      error: null,
    })),

  // Actualizar un color existente
  updateColorInStore: (id, updatedColor) =>
    set((state) => ({
      colors: state.colors.map((color) =>
        color.id === id ? updatedColor : color
      ),
      selectedColor:
        state.selectedColor?.id === id ? updatedColor : state.selectedColor,
      error: null,
    })),

  // Remover un color por ID
  removeColorFromStore: (id) =>
    set((state) => ({
      colors: state.colors.filter((color) => color.id !== id),
      selectedColor:
        state.selectedColor?.id === id ? null : state.selectedColor,
      error: null,
    })),

  // Establecer color seleccionado
  setSelectedColor: (color) => set({ selectedColor: color }),

  // Establecer estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar colors
  clearColors: () =>
    set({
      colors: [],
      selectedColor: null,
      error: null,
    }),

  // Buscar color por ID en el store local
  getColorById: (id) => {
    const { colors } = get();
    return colors.find((color) => color.id === id);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
