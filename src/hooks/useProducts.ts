import { useShallow } from "zustand/react/shallow";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSearchedProducts,
  getFilteredProducts,
} from "../api/services/ProductService";
import { IProduct } from "../types/Product/IProduct";
import { useProductStore } from "../stores/productStore";
import { IPageableFilter } from "../types/IPageableFilter";
import { IPage } from "../types/IPage";
import { ICreateProduct } from "../types/Product/ICreateProduct";
import { IUpdateProduct } from "../types/Product/IUpdateProduct";
import { IProductFilter } from "../types/Product/IProducFilter";
import { IFilterValues } from "../stores/filterStore";

// Hook principal para Products
interface UseProductsReturn {
  // State from Zustand
  products: IProduct[];
  selectedProduct: IProduct | null;

  // CRUD Operations
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: number) => Promise<IProduct | null>;
  handleCreateProduct: (data: ICreateProduct) => Promise<boolean>;
  handleUpdateProduct: (id: number, data: IUpdateProduct) => Promise<boolean>;
  handleDeleteProduct: (id: number) => Promise<boolean>;

  // State Management
  setSelectedProduct: (product: IProduct | null) => void;
  refreshProducts: () => Promise<void>;
  clearProducts: () => void;
  actionSearch: (
    searchTerm: string,
    pageable: IPageableFilter
  ) => Promise<IPage<IProduct> | null>;

  filterProducts: (
    filters: IFilterValues,
    pageable: IPageableFilter
  ) => Promise<IPage<IProduct> | null>;
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

  const filterProducts = async (
    filters: IFilterValues,
    pageable: IPageableFilter
  ): Promise<IPage<IProduct> | null> => {
    const productFilter: IProductFilter = {
      genre: filters.genre,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      typeId: filters.type?.id || null,
      colorId: filters.color?.id || null,
      categoryIds: filters.categories?.map((c) => c.id) || null,
    };
    try {
      const data = await getFilteredProducts(productFilter, pageable);
      setProducts(data.content);
      return data;
    } catch (error) {
      console.log("Error al filtrar productos:", error);
      return null;
    }
  };

  const actionSearch = async (
    searchTerm: string,
    pageable: IPageableFilter
  ): Promise<IPage<IProduct> | null> => {
    try {
      const data = await getSearchedProducts(searchTerm, pageable);
      if (data.size > 0) {
        setProducts(data.content);
      } else {
        setProducts([]);
        console.log("No products found for the search term:", searchTerm);
      }
      return data;
    } catch (error) {
      console.log("Error al buscar productos:", error);
      return null;
    }
  };

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
  const handleCreateProduct = async (
    data: ICreateProduct
  ): Promise<boolean> => {
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
    data: IUpdateProduct
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
    actionSearch,
    filterProducts,
  };
};
