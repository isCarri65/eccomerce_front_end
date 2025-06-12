import { useShallow } from "zustand/react/shallow";
import {
  getAllUsers,
  getUserById,
  getUserProfile,
  createUser,
  updateUserProfile,
  deleteUser,
} from "../api/services/UserService";
import { IUser } from "../types/User/IUser";
import { useUserStore } from "../stores/userStore";

// Hook principal para Users
interface UseUsersReturn {
  // State from Zustand
  users: IUser[];
  selectedUser: IUser | null;
  currentUserProfile: IUser | null;

  // CRUD Operations
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<IUser | null>;
  fetchUserProfile: () => Promise<IUser | null>;
  handleCreateUser: (data: IUser) => Promise<boolean>;
  handleUpdateUserProfile: (data: IUser) => Promise<boolean>;
  handleDeleteUser: (id: number) => Promise<boolean>;

  // State Management
  setSelectedUser: (user: IUser | null) => void;
  setCurrentUserProfile: (user: IUser | null) => void;
  refreshUsers: () => Promise<void>;
  clearUsers: () => void;
}

export const useUsers = (): UseUsersReturn => {
  const {
    users,
    selectedUser,
    currentUserProfile,
    setUsers,
    addUser,
    updateUserInStore,
    removeUserFromStore,
    setSelectedUser,
    setCurrentUserProfile,
    clearUsers,
  } = useUserStore(
    useShallow((state) => ({
      users: state.users,
      selectedUser: state.selectedUser,
      currentUserProfile: state.currentUserProfile,
      setUsers: state.setUsers,
      addUser: state.addUser,
      updateUserInStore: state.updateUserInStore,
      removeUserFromStore: state.removeUserFromStore,
      setSelectedUser: state.setSelectedUser,
      setCurrentUserProfile: state.setCurrentUserProfile,
      clearUsers: state.clearUsers,
    }))
  );

  // Obtener todos los usuarios (admin)
  const fetchUsers = async (): Promise<void> => {
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.log("Error al obtener usuarios:", error);
    }
  };

  // Obtener usuario por ID (admin)
  const fetchUserById = async (id: number): Promise<IUser | null> => {
    try {
      const user = await getUserById(id);
      setSelectedUser(user);
      return user;
    } catch (error) {
      console.log("Error al obtener usuario por ID:", error);
      return null;
    }
  };

  // Obtener perfil del usuario actual
  const fetchUserProfile = async (): Promise<IUser | null> => {
    try {
      const profile = await getUserProfile();
      setCurrentUserProfile(profile);
      return profile;
    } catch (error) {
      console.log("Error al obtener perfil de usuario:", error);
      return null;
    }
  };

  // Crear usuario (admin)
  const handleCreateUser = async (data: IUser): Promise<boolean> => {
    try {
      const newUser = await createUser(data);
      addUser(newUser);
      return true;
    } catch (error) {
      console.log("Error al crear usuario:", error);
      return false;
    }
  };

  // Actualizar perfil del usuario actual
  const handleUpdateUserProfile = async (data: IUser): Promise<boolean> => {
    try {
      const updatedProfile = await updateUserProfile(data);
      setCurrentUserProfile(updatedProfile);
      // Si el usuario actualizado está en la lista de usuarios, también actualizarlo ahí
      if (
        currentUserProfile &&
        users.some((user) => user.id === currentUserProfile.id)
      ) {
        updateUserInStore(currentUserProfile.id, updatedProfile);
      }
      return true;
    } catch (error) {
      console.log("Error al actualizar perfil de usuario:", error);
      return false;
    }
  };

  // Eliminar usuario (admin)
  const handleDeleteUser = async (id: number): Promise<boolean> => {
    try {
      await deleteUser(id);
      removeUserFromStore(id);
      return true;
    } catch (error) {
      console.log("Error al eliminar usuario:", error);
      return false;
    }
  };

  // Refrescar usuarios
  const refreshUsers = async (): Promise<void> => {
    await fetchUsers();
  };

  return {
    // State from Zustand
    users,
    selectedUser,
    currentUserProfile,

    // Actions
    fetchUsers,
    fetchUserById,
    fetchUserProfile,
    handleCreateUser,
    handleUpdateUserProfile,
    handleDeleteUser,
    setSelectedUser,
    setCurrentUserProfile,
    refreshUsers,
    clearUsers,
  };
};
