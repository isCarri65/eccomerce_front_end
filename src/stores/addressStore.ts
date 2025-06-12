import { create } from "zustand";
import { Address } from "../types/Address/IAddress";

interface AddressState {
  // Estado
  addresses: Address[];
  selectedAddress: Address | null;
  loading: boolean;
  error: string | null;

  // Acciones para addresses
  setAddresses: (addresses: Address[]) => void;
  addAddressToStore: (address: Address) => void;
  updateAddressInStore: (id: number, updatedAddress: Address) => void;
  removeAddressFromStore: (id: number) => void;

  // Acciones para address seleccionado
  setSelectedAddress: (address: Address | null) => void;

  // Acciones para loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilidades
  clearAddresses: () => void;
  getAddressById: (id: number) => Address | undefined;
  resetStore: () => void;
}

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

export const useAddressStore = create<AddressState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de addresses
  setAddresses: (addresses) => set({ addresses, error: null }),

  // Agregar un nuevo address
  addAddressToStore: (address) =>
    set((state) => ({
      addresses: [...state.addresses, address],
      error: null,
    })),

  // Actualizar un address existente
  updateAddressInStore: (id, updatedAddress) =>
    set((state) => ({
      addresses: state.addresses.map((address) =>
        address.id === id ? updatedAddress : address
      ),
      selectedAddress:
        state.selectedAddress?.id === id
          ? updatedAddress
          : state.selectedAddress,
      error: null,
    })),

  // Remover un address por ID
  removeAddressFromStore: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((address) => address.id !== id),
      selectedAddress:
        state.selectedAddress?.id === id ? null : state.selectedAddress,
      error: null,
    })),

  // Establecer address seleccionado
  setSelectedAddress: (address) => set({ selectedAddress: address }),

  // Establecer estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar addresses
  clearAddresses: () =>
    set({
      addresses: [],
      selectedAddress: null,
      error: null,
    }),

  // Buscar address por ID en el store local
  getAddressById: (id) => {
    const { addresses } = get();
    return addresses.find((address) => address.id === id);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
