import { useShallow } from "zustand/react/shallow";
import {
  getAllAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../api/services/AddressService";
import { Address } from "../types/Address/IAddress";
import { ICreateAddress, IUpdateAddress } from "../types/Address/IAddress"; // Asumiendo que existen estos tipos
import { useAddressStore } from "../stores/addressStore";

// Hook principal para Addresses
interface UseAddressesReturn {
  // State from Zustand
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string | null;

  // CRUD Operations
  fetchAddresses: () => Promise<void>;
  fetchAddressById: (id: number) => Promise<Address | null>;
  handleCreateAddress: (address: Address) => Promise<ICreateAddress | null>;
  handleUpdateAddress: (
    id: number,
    address: Address
  ) => Promise<IUpdateAddress | null>;
  handleDeleteAddress: (id: number) => Promise<boolean>;

  // State Management
  setSelectedAddress: (address: Address | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshAddresses: () => Promise<void>;
  clearAddresses: () => void;

  // Utility functions
  getAddressFromStore: (id: number) => Address | undefined;
  resetStore: () => void;
}

export const useAddresses = (): UseAddressesReturn => {
  const {
    addresses,
    selectedAddress,
    loading,
    error,
    setAddresses,
    addAddressToStore,
    updateAddressInStore,
    removeAddressFromStore,
    setSelectedAddress,
    setLoading,
    setError,
    clearAddresses,
    getAddressById: getAddressFromStore,
    resetStore,
  } = useAddressStore(
    useShallow((state) => ({
      addresses: state.addresses,
      selectedAddress: state.selectedAddress,
      loading: state.loading,
      error: state.error,
      setAddresses: state.setAddresses,
      addAddressToStore: state.addAddressToStore,
      updateAddressInStore: state.updateAddressInStore,
      removeAddressFromStore: state.removeAddressFromStore,
      setSelectedAddress: state.setSelectedAddress,
      setLoading: state.setLoading,
      setError: state.setError,
      clearAddresses: state.clearAddresses,
      getAddressById: state.getAddressById,
      resetStore: state.resetStore,
    }))
  );

  // Obtener todas las addresses
  const fetchAddresses = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const addressesData = await getAllAddresses();
      setAddresses(addressesData);
    } catch (error) {
      const errorMessage = "Error al obtener addresses";
      console.log(errorMessage, error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener address por ID
  const fetchAddressById = async (id: number): Promise<Address | null> => {
    setLoading(true);
    setError(null);
    try {
      const address = await getAddressById(id);
      setSelectedAddress(address);
      return address;
    } catch (error) {
      const errorMessage = "Error al obtener address por ID";
      console.log(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Crear address
  const handleCreateAddress = async (
    address: Address
  ): Promise<ICreateAddress | null> => {
    setLoading(true);
    setError(null);
    try {
      const newAddress = await createAddress(address);
      // Asumiendo que la respuesta incluye el address creado
      if (newAddress && "id" in newAddress) {
        addAddressToStore(newAddress as Address);
      }
      return newAddress;
    } catch (error) {
      const errorMessage = "Error al crear address";
      console.log(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar address
  const handleUpdateAddress = async (
    id: number,
    address: Address
  ): Promise<IUpdateAddress | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedAddress = await updateAddress(id, address);
      // Asumiendo que la respuesta incluye el address actualizado
      if (updatedAddress && "id" in updatedAddress) {
        updateAddressInStore(id, updatedAddress as Address);
      }
      return updatedAddress;
    } catch (error) {
      const errorMessage = "Error al actualizar address";
      console.log(errorMessage, error);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar address
  const handleDeleteAddress = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteAddress(id);
      removeAddressFromStore(id);
      return true;
    } catch (error) {
      const errorMessage = "Error al eliminar address";
      console.log(errorMessage, error);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar addresses
  const refreshAddresses = async (): Promise<void> => {
    await fetchAddresses();
  };

  return {
    // State from Zustand
    addresses,
    selectedAddress,
    loading,
    error,

    // CRUD Operations
    fetchAddresses,
    fetchAddressById,
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,

    // State Management
    setSelectedAddress,
    setLoading,
    setError,
    refreshAddresses,
    clearAddresses,

    // Utility functions
    getAddressFromStore,
    resetStore,
  };
};
