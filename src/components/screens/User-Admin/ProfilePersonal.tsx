import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePersonal.module.css";
import {
  getAllAddresses,
  createAddress,
} from "../../../api/services/AddressService";
import { IUser } from "../../../types/User/IUser";
import { ICreateAddress } from "../../../types/Address/ICreateAddress";
import { Button } from "../../ui/Button";
import { useMessageStore } from "../../../stores/messageStore";
import { useUsers } from "../../../hooks/useUsers";
import { useAuth } from "../../../hooks/useAuth";
import { IAddress } from "../../../types/Address/IAddress";

interface AddressFormProps {
  onClose: () => void;
  onAddressCreated: () => void;
}

const initialAddress: ICreateAddress = {
  street: "",
  locality: "",
  province: "",
  cp: "",
  dptoFloor: "",
};

const AddressForm: React.FC<AddressFormProps> = ({
  onClose,
  onAddressCreated,
}) => {
  const [form, setForm] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessageStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAddress(form);
      addMessage("Dirección creada exitosamente", "success");
      onAddressCreated();
      onClose();
    } catch (error: any) {
      addMessage(error.message || "Error al crear la dirección", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Agregar dirección</h3>
        <form className={styles.addressForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Calle</label>
            <input
              name="street"
              value={form.street}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label>Localidad</label>
            <input
              name="locality"
              value={form.locality}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label>Provincia</label>
            <input
              name="province"
              value={form.province}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label>Código Postal</label>
            <input name="cp" value={form.cp} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Departamento/Piso</label>
            <input
              name="dptoFloor"
              value={form.dptoFloor}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formActions}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creando..." : "Confirmar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Regresar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProfilePersonal = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addMessage } = useMessageStore();
  const [user, setUser] = useState<IUser | null>(null);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUserProfile, handleUpdateUserProfile, fetchUserProfile } =
    useUsers();

  useEffect(() => {
    if (currentUserProfile === null) {
      fetchUserProfile();
    }
  }, []);

  const loadAddresses = async () => {
    try {
      const addressesData = await getAllAddresses();
      setAddresses(addressesData);
    } catch (error: any) {
      addMessage(error.message || "Error al cargar las direcciones", "error");
    }
  };

  const handleEdit = () => {
    setForm(user);
    setEditMode(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form) {
      try {
        const updated = await updateUserProfile(form);
        setUser(updated);
        setEditMode(false);
        addMessage("Perfil actualizado exitosamente", "success");
      } catch (error: any) {
        addMessage(error.message || "Error al actualizar el perfil", "error");
      }
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Llamar al endpoint de logout
      await logout();

      sessionStorage.removeItem("sesionToken");
      addMessage("Sesión cerrada exitosamente", "success");
      navigate("/");
    } catch (error: any) {
      addMessage(error.message || "Error al cerrar sesión", "error");
    } finally {
      setLoading(false);
    }
  };

  if (showAddressForm) {
    return (
      <AddressForm
        onClose={() => setShowAddressForm(false)}
        onAddressCreated={loadAddresses}
      />
    );
  }

  return (
    <div className={styles.profilePersonalContainer}>
      <h1 className={styles.title}>Perfil de usuario</h1>
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Informacion de usuario</h2>
        {!editMode ? (
          <div className={styles.infoBlock}>
            <div>
              <b>Nombre:</b> {currentUserProfile?.name}
            </div>
            <div>
              <b>Apellido:</b> {currentUserProfile?.lastName}
            </div>
            <div>
              <b>Correo Electrónico:</b> {currentUserProfile?.email}
            </div>
            <div>
              <b>Fecha de Nacimiento:</b> {currentUserProfile?.birthDate || "-"}
            </div>
            <div>
              <b>Nro de telefono:</b> {currentUserProfile?.phoneNumber || "-"}
            </div>
            <Button
              variant="primary"
              onClick={handleEdit}
              className={styles.editBtn}
            >
              Editar Información
            </Button>
          </div>
        ) : (
          <form className={styles.editForm} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <label>Nombre</label>
              <input
                name="name"
                value={form?.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Apellido</label>
              <input
                name="lastName"
                value={form?.lastName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Correo Electrónico</label>
              <input
                name="email"
                value={form?.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label>Fecha de Nacimiento</label>
              <input
                name="birthDate"
                value={form?.birthDate || ""}
                onChange={handleChange}
                type="date"
              />
            </div>
            <div className={styles.formRow}>
              <label>Teléfono</label>
              <input
                name="phoneNumber"
                value={form?.phoneNumber || ""}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
      <div className={styles.card}>
        <div className={styles.addressHeader}>
          <h2 className={styles.sectionTitle}>Direcciones</h2>
          <Button
            variant="primary"
            onClick={() => setShowAddressForm(true)}
            className={styles.addAddressBtn}
          >
            Agregar Dirección
          </Button>
        </div>
        <div className={styles.addressList}>
          {addresses.length === 0 ? (
            <p className={styles.noAddresses}>No hay direcciones registradas</p>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className={styles.addressItem}>
                <div className={styles.addressInfo}>
                  <p>
                    <strong>Calle:</strong> {address.street}
                  </p>
                  <p>
                    <strong>Localidad:</strong> {address.locality}
                  </p>
                  <p>
                    <strong>Provincia:</strong> {address.province}
                  </p>
                  <p>
                    <strong>Código Postal:</strong> {address.cp}
                  </p>
                  {address.dptoFloor && (
                    <p>
                      <strong>Departamento/Piso:</strong> {address.dptoFloor}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.sessionBlock}>
          <Button
            variant="outline"
            onClick={handleLogout}
            className={styles.logoutBtn}
            disabled={loading}
          >
            {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
          </Button>
        </div>
      </div>
    </div>
  );
};
