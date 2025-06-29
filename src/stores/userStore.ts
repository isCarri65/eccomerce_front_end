import { create } from "zustand";
import { IUser } from "../types/User/IUser";

interface UserState {
  // Estado
  users: IUser[];
  selectedUser: IUser | null;
  currentUserProfile: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;

  // Acciones para usuarios (admin)
  setUsers: (users: IUser[]) => void;
  addUser: (user: IUser) => void;
  updateUserInStore: (id: number, updatedUser: IUser) => void;
  removeUserFromStore: (id: number) => void;

  // Acciones para usuario seleccionado (admin)
  setSelectedUser: (user: IUser | null) => void;

  // Acciones para perfil del usuario actual
  setCurrentUserProfile: (user: IUser | null) => void;

  // Acciones para autenticación
  login: (user: IUser) => void;
  logout: () => void;

  // Acciones para loading y error
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utilidades
  clearUsers: () => void;
  getUserById: (id: number) => IUser | undefined;
  resetStore: () => void;
}

const initialState = {
  users: [],
  selectedUser: null,
  currentUserProfile: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
};

export const useUserStore = create<UserState>((set, get) => ({
  ...initialState,

  // Establecer lista completa de usuarios (admin)
  setUsers: (users) => set({ users, error: null }),

  // Agregar un nuevo usuario (admin)
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
      error: null,
    })),

  // Actualizar un usuario existente (admin)
  updateUserInStore: (id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) => (user.id === id ? updatedUser : user)),
      selectedUser:
        state.selectedUser?.id === id ? updatedUser : state.selectedUser,
      currentUserProfile:
        state.currentUserProfile?.id === id
          ? updatedUser
          : state.currentUserProfile,
      error: null,
    })),

  // Eliminar un usuario (admin)
  removeUserFromStore: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
      currentUserProfile:
        state.currentUserProfile?.id === id ? null : state.currentUserProfile,
      error: null,
    })),

  // Establecer usuario seleccionado (admin)
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Establecer perfil del usuario actual
  setCurrentUserProfile: (user) => set({ currentUserProfile: user }),

  // Acciones de autenticación
  login: (user: IUser) => {
    set({
      isAuthenticated: true,
      currentUserProfile: user,
      error: null,
    });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      isAuthenticated: false,
      token: null,
      currentUserProfile: null,
      error: null,
    });
  },

  // Establecer estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Limpiar lista de usuarios
  clearUsers: () =>
    set({
      users: [],
      selectedUser: null,
      error: null,
    }),

  // Buscar usuario por ID en el store local
  getUserById: (id) => {
    const { users } = get();
    return users.find((user) => user.id === id);
  },

  // Resetear todo el store al estado inicial
  resetStore: () => set(initialState),
}));
