import { useState, useEffect } from "react";
import {
  getAllCategorys,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesByTypeId,
} from "../api/services/CategoryService";
import { ICategory } from "../types/Category/ICategory";
import { useCategoryStore } from "../stores/categoryStore";

// Hook principal para Categories
interface UseCategoriesReturn {
  // State from Zustand
  categories: ICategory[];
  selectedCategory: ICategory | null;

  // CRUD Operations
  fetchCategories: () => Promise<void>;
  fetchCategoryById: (id: number) => Promise<ICategory | null>;
  handleCreateCategory: (data: ICategory) => Promise<boolean>;
  handleUpdateCategory: (id: number, data: ICategory) => Promise<boolean>;
  handleDeleteCategory: (id: number) => Promise<boolean>;
  fetchCategoriesByTypeId: (typeId: number) => Promise<ICategory[]>;

  // State Management
  setSelectedCategory: (category: ICategory | null) => void;
  refreshCategories: () => Promise<void>;
  clearCategories: () => void;
}

export const useCategories = (): UseCategoriesReturn => {
  const {
    categories,
    selectedCategory,
    setCategories,
    addCategory,
    updateCategoryInStore,
    removeCategoryFromStore,
    setSelectedCategory,
    clearCategories,
  } = useCategoryStore();

  // Obtener todas las categorías
  const fetchCategories = async (): Promise<void> => {
    try {
      const categoriesData = await getAllCategorys();
      setCategories(categoriesData);
    } catch (error) {
      // El interceptor maneja el error con SweetAlert
    }
  };

  // Obtener categoría por ID
  const fetchCategoryById = async (id: number): Promise<ICategory | null> => {
    try {
      const category = await getCategoryById(id);
      setSelectedCategory(category);
      return category;
    } catch (error) {
      // El interceptor maneja el error con SweetAlert
      return null;
    }
  };

  // Crear categoría
  const handleCreateCategory = async (data: ICategory): Promise<boolean> => {
    try {
      const newCategory = await createCategory(data);
      addCategory(newCategory);
      return true;
    } catch (error) {
      // El interceptor maneja el error con SweetAlert
      return false;
    }
  };

  // Actualizar categoría
  const handleUpdateCategory = async (
    id: number,
    data: ICategory
  ): Promise<boolean> => {
    try {
      const updatedCategory = await updateCategory(id, data);
      updateCategoryInStore(id, updatedCategory);
      return true;
    } catch (error) {
      // El interceptor maneja el error con SweetAlert
      return false;
    }
  };

  // Eliminar categoría
  const handleDeleteCategory = async (id: number): Promise<boolean> => {
    try {
      await deleteCategory(id);
      removeCategoryFromStore(id);
      return true;
    } catch (error) {
      // El interceptor maneja el error con SweetAlert
      return false;
    }
  };

  // Obtener categorías por tipo
  const fetchCategoriesByTypeId = async (
    typeId: number
  ): Promise<ICategory[]> => {
    try {
      const categoriesData = await getCategoriesByTypeId(typeId);
      setCategories(categoriesData);
      return categoriesData;
    } catch (error) {
      // El interceptor maneja el error con SweetAlert
      return [];
    }
  };

  // Refrescar categorías
  const refreshCategories = async (): Promise<void> => {
    await fetchCategories();
  };

  return {
    // State from Zustand
    categories,
    selectedCategory,

    // Actions
    fetchCategories,
    fetchCategoryById,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    fetchCategoriesByTypeId,
    setSelectedCategory,
    refreshCategories,
    clearCategories,
  };
};

// Hook específico para obtener categorías por tipo (sin afectar el store principal)
export const useCategoriesByType = (typeId: number | null) => {
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchCategoriesByType = async (id: number) => {
    try {
      const data = await getCategoriesByTypeId(id);
      setCategories(data);
    } catch (err) {
      // El interceptor maneja el error con SweetAlert
    }
  };

  useEffect(() => {
    if (typeId) {
      fetchCategoriesByType(typeId);
    }
  }, [typeId]);

  return {
    categories,
    refetch: () => typeId && fetchCategoriesByType(typeId),
  };
};
