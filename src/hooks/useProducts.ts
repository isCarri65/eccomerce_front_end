import { useShallow } from "zustand/react/shallow";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/services/ProductService";
import { IProduct } from "../types/Product/IProduct";
import { useProductStore } from "../stores/productStore";

// Hook principal para Products
interface UseProductsReturn {
  // State from Zustand
  products: IProduct[];
  selectedProduct: IProduct | null;

  // CRUD Operations
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<IProduct | null>;
  handleCreateProduct: (data: IProduct) => Promise<boolean>;
  handleUpdateProduct: (id: number, data: IProduct) => Promise<boolean>;
  handleDeleteProduct: (id: number) => Promise<boolean>;

  // State Management
  setSelectedProduct: (product: IProduct | null) => void;
  refreshProducts: () => Promise<void>;
  clearProducts: () => void;
}

export const useProducts = (): UseProductsReturn => {
  const {
    products,
    selectedProduct,
    setProducts,
    addProduct,
    updateProductInStore,
    removeProductFromStore,
    setSelectedProduct,
    clearProducts,
  } = useProductStore(
    useShallow((state) => ({
      products: state.products,
      selectedProduct: state.selectedProduct,
      setProducts: state.setProducts,
      addProduct: state.addProduct,
      updateProductInStore: state.updateProductInStore,
      removeProductFromStore: state.removeProductFromStore,
      setSelectedProduct: state.setSelectedProduct,
      clearProducts: state.clearProducts,
    }))
  );

  // Obtener todos los productos
  const fetchProducts = async (): Promise<void> => {
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.log("Error al obtener productos:", error);
    }
  };

  // Obtener producto por ID
  const fetchProductById = async (id: number): Promise<IProduct | null> => {
    try {
      const product = await getProductById(id);
      setSelectedProduct(product);
      return product;
    } catch (error) {
      console.log("Error al obtener producto por ID:", error);
      return null;
    }
  };

  // Crear producto
  const handleCreateProduct = async (data: IProduct): Promise<boolean> => {
    try {
      const newProduct = await createProduct(data);
      addProduct(newProduct);
      return true;
    } catch (error) {
      console.log("Error al crear producto:", error);
      return false;
    }
  };

  // Actualizar producto
  const handleUpdateProduct = async (
    id: number,
    data: IProduct
  ): Promise<boolean> => {
    try {
      const updatedProduct = await updateProduct(id, data);
      updateProductInStore(id, updatedProduct);
      return true;
    } catch (error) {
      console.log("Error al actualizar producto:", error);
      return false;
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id: number): Promise<boolean> => {
    try {
      await deleteProduct(id);
      removeProductFromStore(id);
      return true;
    } catch (error) {
      console.log("Error al eliminar producto:", error);
      return false;
    }
  };

  // Refrescar productos
  const refreshProducts = async (): Promise<void> => {
    await fetchProducts();
  };

  return {
    // State from Zustand
    products,
    selectedProduct,

    // Actions
    fetchProducts,
    fetchProductById,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    setSelectedProduct,
    refreshProducts,
    clearProducts,
  };
};
