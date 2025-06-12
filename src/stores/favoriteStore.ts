import { create } from "zustand";
import { IFavorite } from "../types/Favorite/IFavorite";
import { IProduct } from "../types/Product/IProduct";

interface FavoriteState {
  // Estado
  favorites: IFavorite[];
  selectedFavorite: IFavorite | null;
  userFavoriteProducts: IProduct[];
  loading: boolean;
  error: string | null;

  // Acciones para favoritos
  setFavorites: (favorites: IFavorite[]) => void;
  addFavoriteToStore: (favorite: IFavorite) => void;
  removeFavoriteFromStore: (userId: number, productId: number) => void;

  // Acciones para favorito seleccionado
  setSelectedFavorite: (favorite: IFavorite | null) => void;

  // Acciones para productos favoritos del usuario
  setUserFavoriteProducts: (products: IProduct[]) => void;
  addProductToUserFavorites: (product: IProduct) => void;
  removeProductFromUserFavorites: (productId: number) => void;

  // Acciones para loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilidades
  clearFavorites: () => void;
  getFavoriteById: (id: number) => IFavorite | undefined;
  getFavoriteByUserAndProduct: (
    userId: number,
    productId: number
  ) => IFavorite | undefined;
  isProductInUserFavorites: (productId: number) => boolean;
  resetStore: () => void;
}

const initialState = {
  favorites: [],
  selectedFavorite: null,
  userFavoriteProducts: [],
  loading: false,
  error: null,
};

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de favoritos
  setFavorites: (favorites) => set({ favorites, error: null }),

  // Agregar un nuevo favorito
  addFavoriteToStore: (favorite) =>
    set((state) => ({
      favorites: [...state.favorites, favorite],
      error: null,
    })),

  // Remover un favorito por userId y productId
  removeFavoriteFromStore: (userId, productId) =>
    set((state) => ({
      favorites: state.favorites.filter(
        (favorite) =>
          !(favorite.userId === userId && favorite.productId === productId)
      ),
      userFavoriteProducts: state.userFavoriteProducts.filter(
        (product) => product.id !== productId
      ),
      error: null,
    })),

  // Establecer favorito seleccionado
  setSelectedFavorite: (favorite) => set({ selectedFavorite: favorite }),

  // Establecer productos favoritos del usuario
  setUserFavoriteProducts: (products) =>
    set({ userFavoriteProducts: products, error: null }),

  // Agregar producto a favoritos del usuario
  addProductToUserFavorites: (product) =>
    set((state) => ({
      userFavoriteProducts: [...state.userFavoriteProducts, product],
      error: null,
    })),

  // Remover producto de favoritos del usuario
  removeProductFromUserFavorites: (productId) =>
    set((state) => ({
      userFavoriteProducts: state.userFavoriteProducts.filter(
        (product) => product.id !== productId
      ),
      error: null,
    })),

  // Establecer estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar favoritos
  clearFavorites: () =>
    set({
      favorites: [],
      selectedFavorite: null,
      userFavoriteProducts: [],
      error: null,
    }),

  // Buscar favorito por ID en el store local
  getFavoriteById: (id) => {
    const { favorites } = get();
    return favorites.find((favorite) => favorite.id === id);
  },

  // Buscar favorito por userId y productId
  getFavoriteByUserAndProduct: (userId, productId) => {
    const { favorites } = get();
    return favorites.find(
      (favorite) =>
        favorite.userId === userId && favorite.productId === productId
    );
  },

  // Verificar si un producto está en los favoritos del usuario
  isProductInUserFavorites: (productId) => {
    const { userFavoriteProducts } = get();
    return userFavoriteProducts.some((product) => product.id === productId);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
