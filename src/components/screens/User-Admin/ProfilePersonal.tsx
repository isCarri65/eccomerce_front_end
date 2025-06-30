import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePersonal.module.css';
import { getUserProfile, updateUserProfile, logout } from '../../../api/services/UserService';
import { getAllAddresses, createAddress } from '../../../api/services/AddressService';
import { IUser } from '../../../types/User/IUser';
import { Address } from '../../../types/Address/IAddress';
import { ICreateAddress } from '../../../types/Address/ICreateAddress';
import { Button } from '../../ui/ElementsHTML/Button';
import { useUserStore } from '../../../stores/userStore';
import { useMessageStore } from '../../../stores/messageStore';
import axios from 'axios';

interface AddressFormProps {
  onClose: () => void;
  onAddressCreated: () => void;
}

const initialAddress: ICreateAddress = {
  street: '',
  locality: '',
  province: '',
  cp: '',
  dptoFloor: '',
};

const AddressForm: React.FC<AddressFormProps> = ({ onClose, onAddressCreated }) => {
  const BASEURL = "http://localhost:8081/"
  const [form, setForm] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessageStore();
  const { currentUserProfile } = useUserStore();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = sessionStorage.getItem('sesionToken'); // O como lo hayas guardado
    const response = await axios.post(
      `${BASEURL}api/protected/addresses/create`,
      {
        ...form,
        user: { id: currentUserProfile?.id } // o el ID dinámico del usuario actual
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Dirección creada:', response.data);
    onClose();
  } catch (error: any) {
    console.error('Error al crear la dirección:', error.response?.data || error.message, error);
    alert('Error al crear la dirección');
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
            <label>Localidad</label>
            <input name="locality" value={form.locality} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Provincia</label>
            <input name="province" value={form.province} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Código Postal</label>
            <input name="cp" value={form.cp} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Departamento/Piso</label>
            <input name="dptoFloor" value={form.dptoFloor} onChange={handleChange} />
          </div>
          <div className={styles.formActions}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Creando..." : "Confirmar"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Regresar</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ProfilePersonal: React.FC = () => {
  const navigate = useNavigate();
  const { logout: logoutStore } = useUserStore();
  const { addMessage } = useMessageStore();
  const [user, setUser] = useState<IUser | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfile().then(setUser);
    loadAddresses();
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

      // Limpiar el store y navegar
      logoutStore();
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
    return <AddressForm onClose={() => setShowAddressForm(false)} onAddressCreated={loadAddresses} />;
  }

  return (
    <div className={styles.profilePersonalContainer}>
      <h1 className={styles.title}>Perfil de usuario</h1>
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Informacion de usuario</h2>
        {!editMode ? (
          <div className={styles.infoBlock}>
            <div><b>Nombre:</b> {user?.name}</div>
            <div><b>Apellido:</b> {user?.lastName}</div>
            <div><b>Correo Electrónico:</b> {user?.email}</div>
            <div><b>Fecha de Nacimiento:</b> {user?.birthDate || '-'}</div>
            <div><b>Nro de telefono:</b> {user?.phoneNumber || '-'}</div>
            <Button variant="primary" onClick={handleEdit} className={styles.editBtn}>Editar Información</Button>
          </div>
        ) : (
          <form className={styles.editForm} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <label>Nombre</label>
              <input name="name" value={form?.name || ''} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
              <label>Apellido</label>
              <input name="lastName" value={form?.lastName || ''} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
              <label>Correo Electrónico</label>
              <input name="email" value={form?.email || ''} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
              <label>Fecha de Nacimiento</label>
              <input name="birthDate" value={form?.birthDate || ''} onChange={handleChange} type="date" />
            </div>
            <div className={styles.formRow}>
              <label>Teléfono</label>
              <input name="phoneNumber" value={form?.phoneNumber || ''} onChange={handleChange} />
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="primary">Guardar</Button>
              <Button type="button" variant="outline" onClick={() => setEditMode(false)}>Cancelar</Button>
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
                  <p><strong>Localidad:</strong> {address.locality}</p>
                  <p><strong>Provincia:</strong> {address.province}</p>
                  <p><strong>Código Postal:</strong> {address.cp}</p>
                  {address.dptoFloor && (
                    <p><strong>Departamento/Piso:</strong> {address.dptoFloor}</p>
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