import { create } from "zustand";
import { IProduct } from "../types/Product/IProduct";

interface ProductState {
  // Estado
  products: IProduct[];
  selectedProduct: IProduct | null;
  loading: boolean;
  error: string | null;

  // Acciones para productos
  setProducts: (products: IProduct[]) => void;
  addProduct: (product: IProduct) => void;
  updateProductInStore: (id: number, updatedProduct: IProduct) => void;
  removeProductFromStore: (id: number) => void;

  // Acciones para producto seleccionado
  setSelectedProduct: (product: IProduct | null) => void;

  // Acciones para loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilidades
  clearProducts: () => void;
  getProductById: (id: number) => IProduct | undefined;
  resetStore: () => void;
}

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

export const useProductStore = create<ProductState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de productos
  setProducts: (products) => set({ products, error: null }),

  // Agregar un nuevo producto
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      error: null,
    })),

  // Actualizar un producto existente
  updateProductInStore: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? updatedProduct : product
      ),
      selectedProduct:
        state.selectedProduct?.id === id
          ? updatedProduct
          : state.selectedProduct,
      error: null,
    })),

  // Eliminar un producto
  removeProductFromStore: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      selectedProduct:
        state.selectedProduct?.id === id ? null : state.selectedProduct,
      error: null,
    })),

  // Establecer producto seleccionado
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  // Establecer estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar lista de productos
  clearProducts: () =>
    set({ products: [], selectedProduct: null, error: null }),

  // Buscar producto por ID en el store local
  getProductById: (id) => {
    const { products } = get();
    return products.find((product) => product.id === id);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
