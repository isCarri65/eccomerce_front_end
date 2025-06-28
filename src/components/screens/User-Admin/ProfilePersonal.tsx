import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePersonal.module.css';
import { getUserProfile, updateUserProfile, logout } from '../../../api/services/UserService';
import { IUser } from '../../../types/User/IUser';
import { Button } from '../../ui/Button';
import { useUserStore } from '../../../stores/userStore';
import { useMessageStore } from '../../../stores/messageStore';

interface AddressFormProps {
  onClose: () => void;
}

const initialAddress = {
  street: '',
  number: '',
  apartment: '',
  aptNumberAndFloor: '',
  province: '',
  locality: '',
  postal: '',
};

const AddressForm: React.FC<AddressFormProps> = ({ onClose }) => {
  const [form, setForm] = useState(initialAddress);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se llamará a createAddress en el futuro
    onClose();
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
            <input name="number" value={form.number} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Apartamento</label>
            <input name="apartment" value={form.apartment} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label>Piso y Número</label>
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
            <Button type="submit" variant="primary">Confirmar</Button>
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
  const [editMode, setEditMode] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [form, setForm] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserProfile().then(setUser);
  }, []);

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
    return <AddressForm onClose={() => setShowAddressForm(false)} />;
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
        <h2 className={styles.sectionTitle}>Direcciones</h2>
        <div className={styles.addressBlock}>
          <button className={styles.addAddressBtn} onClick={() => setShowAddressForm(true)}>
            <span className={styles.plus}>+</span>
            <span>Agregar dirección</span>
          </button>
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