import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfilePersonal.module.css";
import {
  getAllAddresses,
  createAddress,
  updateAddress,
} from "../../../api/services/AddressService";
import { IUser } from "../../../types/User/IUser";
import { Address } from "../../../types/Address/IAddress";
import { ICreateAddress } from "../../../types/Address/ICreateAddress";
import { Button } from "../../ui/Button";
import { useMessageStore } from "../../../stores/messageStore";
import { useUsers } from "../../../hooks/useUsers";
import { useAuth } from "../../../hooks/useAuth";

const initialAddress: ICreateAddress = {
  street: "",
  number: 0,
  apartment: "",
  aptNumberAndFloor: "",
  province: "",
  locality: "",
  postal: "",
};

const AddressForm: React.FC<{
  onClose: () => void;
  onAddressCreated: () => void;
}> = ({ onClose, onAddressCreated }) => {
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
            <input name="street" value={form.street} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Número</label>
            <input name="number" type="number" value={form.number} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Departamento</label>
            <input name="apartment" value={form.apartment} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label>Departamento/Piso</label>
            <input name="aptNumberAndFloor" value={form.aptNumberAndFloor} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label>Provincia</label>
            <input name="province" value={form.province} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Localidad</label>
            <input name="locality" value={form.locality} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Código Postal</label>
            <input name="postal" value={form.postal} onChange={handleChange} required />
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

const EditAddressForm: React.FC<{
  address: Address;
  onClose: () => void;
  onAddressUpdated: () => void;
}> = ({ address, onClose, onAddressUpdated }) => {
  const [form, setForm] = useState({ ...address });
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessageStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAddress(address.id, form);
      addMessage("Dirección actualizada exitosamente", "success");
      onAddressUpdated();
      onClose();
    } catch (error: any) {
      addMessage(error.message || "Error al actualizar la dirección", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Editar dirección</h3>
        <form className={styles.addressForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label>Calle</label>
            <input name="street" value={form.street || ""} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Número</label>
            <input
              name="number"
              type="number"
              value={form.number !== null && form.number !== undefined ? form.number : ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formRow}>
            <label>Departamento</label>
            <input name="apartment" value={form.apartment || ""} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label>Departamento/Piso</label>
            <input
              name="aptNumberAndFloor"
              value={form.aptNumberAndFloor || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formRow}>
            <label>Provincia</label>
            <input name="province" value={form.province || ""} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Localidad</label>
            <input name="locality" value={form.locality || ""} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Código Postal</label>
            <input name="postal" value={form.postal || ""} onChange={handleChange} />
          </div>
          <div className={styles.formActions}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUserProfile, handleUpdateUserProfile, fetchUserProfile } = useUsers();
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [showEditAddressForm, setShowEditAddressForm] = useState(false);

  useEffect(() => {
    if (currentUserProfile === null) {
      fetchUserProfile();
    } else {
      setForm(currentUserProfile);
      loadAddresses();
    }
    // eslint-disable-next-line
  }, [currentUserProfile]);

  const loadAddresses = async () => {
    try {
      const addressesData = await getAllAddresses();
      setAddresses(addressesData);
    } catch (error: any) {
      addMessage(error.message || "Error al cargar las direcciones", "error");
    }
  };

  const handleEdit = () => {
    setForm(currentUserProfile);
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
        const success = await handleUpdateUserProfile(form);
        if (success) {
          setEditMode(false);
          addMessage("Perfil actualizado exitosamente", "success");
        } else {
          addMessage("Error al actualizar el perfil", "error");
        }
      } catch (error: any) {
        addMessage(error.message || "Error al actualizar el perfil", "error");
      }
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
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
      <AddressForm onClose={() => setShowAddressForm(false)} onAddressCreated={loadAddresses} />
    );
  }

  if (showEditAddressForm && editAddress) {
    return (
      <EditAddressForm
        address={editAddress}
        onClose={() => setShowEditAddressForm(false)}
        onAddressUpdated={loadAddresses}
      />
    );
  }

  return (
    <div className={styles.profilePersonalContainer}>
      <h1 className={styles.title}>Perfil de usuario</h1>
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Información de usuario</h2>
        {!editMode ? (
          <div className={styles.infoBlock}>
            <div>
              <b>Nombre:</b> {currentUserProfile?.name}
            </div>
            <div>
              <b>Apellido:</b> {currentUserProfile?.lastName}
            </div>
            <div>
              <b>Fecha de Nacimiento:</b> {currentUserProfile?.birthDate || "-"}
            </div>
            <div>
              <b>Nro de teléfono:</b> {currentUserProfile?.phoneNumber || "-"}
            </div>
            <Button variant="primary" onClick={handleEdit} className={styles.editBtn}>
              Editar Información
            </Button>
          </div>
        ) : !form ? (
          <p className={styles.loading}>Cargando formulario...</p>
        ) : (
          <form className={styles.editForm} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <label>Nombre</label>
              <input name="name" value={form.name || ""} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
              <label>Apellido</label>
              <input name="lastName" value={form.lastName || ""} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
              <label>Fecha de Nacimiento</label>
              <input
                name="birthDate"
                value={form.birthDate || ""}
                onChange={handleChange}
                type="date"
              />
            </div>
            <div className={styles.formRow}>
              <label>Teléfono</label>
              <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
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
                  <p><strong>Calle:</strong> {address.street}</p>
                  <p><strong>Número:</strong> {address.number || "-"}</p>
                  <p><strong>Departamento:</strong> {address.apartment || "-"}</p>
                  <p><strong>Departamento/Piso:</strong> {address.aptNumberAndFloor || "-"}</p>
                  <p><strong>Provincia:</strong> {address.province}</p>
                  <p><strong>Localidad:</strong> {address.locality}</p>
                  <p><strong>Código Postal:</strong> {address.postal || "-"}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditAddress(address);
                    setShowEditAddressForm(true);
                  }}
                  className={styles.editBtn}
                >
                  Editar
                </Button>
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
