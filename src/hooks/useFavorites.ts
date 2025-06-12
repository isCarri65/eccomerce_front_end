import { useShallow } from "zustand/react/shallow";
import {
  getAllFavorites,
  getFavoriteById,
  addFavorite,
  getProductsFavoritesByUserId,
  removeFavorite,
} from "../api/services/FavoriteService";
import { IFavorite } from "../types/Favorite/IFavorite";
import { IProduct } from "../types/Product/IProduct";
import { useFavoriteStore } from "../stores/favoriteStore";

// Hook principal para Favorites
interface UseFavoritesReturn {
  // State from Zustand
  favorites: IFavorite[];
  selectedFavorite: IFavorite | null;
  userFavoriteProducts: IProduct[];

  // CRUD Operations
  fetchFavorites: () => Promise<void>;
  fetchFavoriteById: (id: number) => Promise<IFavorite | null>;
  handleAddFavorite: (favorite: IFavorite) => Promise<boolean>;
  handleRemoveFavorite: (userId: number, productId: number) => Promise<boolean>;
  fetchUserFavoriteProducts: (userId: number) => Promise<IProduct[]>;

  // State Management
  setSelectedFavorite: (favorite: IFavorite | null) => void;
  refreshFavorites: () => Promise<void>;
  clearFavorites: () => void;

  // Utility functions
  isProductFavorite: (productId: number) => boolean;
  toggleFavorite: (
    userId: number,
    productId: number,
    favoriteData?: IFavorite
  ) => Promise<boolean>;
}

export const useFavorites = (): UseFavoritesReturn => {
  const {
    favorites,
    selectedFavorite,
    userFavoriteProducts,
    setFavorites,
    addFavoriteToStore,
    removeFavoriteFromStore,
    setSelectedFavorite,
    setUserFavoriteProducts,
    clearFavorites,
  } = useFavoriteStore(
    useShallow((state) => ({
      favorites: state.favorites,
      selectedFavorite: state.selectedFavorite,
      userFavoriteProducts: state.userFavoriteProducts,
      setFavorites: state.setFavorites,
      addFavoriteToStore: state.addFavoriteToStore,
      removeFavoriteFromStore: state.removeFavoriteFromStore,
      setSelectedFavorite: state.setSelectedFavorite,
      setUserFavoriteProducts: state.setUserFavoriteProducts,
      clearFavorites: state.clearFavorites,
    }))
  );

  // Obtener todos los favoritos
  const fetchFavorites = async (): Promise<void> => {
    try {
      const favoritesData = await getAllFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.log("Error al obtener favoritos:", error);
    }
  };

  // Obtener favorito por ID
  const fetchFavoriteById = async (id: number): Promise<IFavorite | null> => {
    try {
      const favorite = await getFavoriteById(id);
      setSelectedFavorite(favorite);
      return favorite;
    } catch (error) {
      console.log("Error al obtener favorito por ID:", error);
      return null;
    }
  };

  // Agregar favorito
  const handleAddFavorite = async (favorite: IFavorite): Promise<boolean> => {
    try {
      const newFavorite = await addFavorite(favorite);
      addFavoriteToStore(newFavorite);
      return true;
    } catch (error) {
      console.log("Error al agregar favorito:", error);
      return false;
    }
  };

  // Remover favorito
  const handleRemoveFavorite = async (
    userId: number,
    productId: number
  ): Promise<boolean> => {
    try {
      await removeFavorite(userId, productId);
      removeFavoriteFromStore(userId, productId);
      return true;
    } catch (error) {
      console.log("Error al remover favorito:", error);
      return false;
    }
  };

  // Obtener productos favoritos de un usuario
  const fetchUserFavoriteProducts = async (
    userId: number
  ): Promise<IProduct[]> => {
    try {
      const products = await getProductsFavoritesByUserId(userId);
      setUserFavoriteProducts(products);
      return products;
    } catch (error) {
      console.log("Error al obtener productos favoritos del usuario:", error);
      return [];
    }
  };

  // Verificar si un producto es favorito
  const isProductFavorite = (productId: number): boolean => {
    return userFavoriteProducts.some((product) => product.id === productId);
  };

  // Toggle favorito (agregar/remover)
  const toggleFavorite = async (
    userId: number,
    productId: number,
    favoriteData?: IFavorite
  ): Promise<boolean> => {
    const isFavorite = isProductFavorite(productId);

    if (isFavorite) {
      return await handleRemoveFavorite(userId, productId);
    } else {
      if (!favoriteData) {
        console.log("Error: favoriteData es requerido para agregar favorito");
        return false;
      }
      return await handleAddFavorite(favoriteData);
    }
  };

  // Refrescar favoritos
  const refreshFavorites = async (): Promise<void> => {
    await fetchFavorites();
  };

  return {
    // State from Zustand
    favorites,
    selectedFavorite,
    userFavoriteProducts,

    // Actions
    fetchFavorites,
    fetchFavoriteById,
    handleAddFavorite,
    handleRemoveFavorite,
    fetchUserFavoriteProducts,
    setSelectedFavorite,
    refreshFavorites,
    clearFavorites,

    // Utility functions
    isProductFavorite,
    toggleFavorite,
  };
};
