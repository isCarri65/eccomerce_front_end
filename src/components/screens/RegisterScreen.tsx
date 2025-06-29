import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/services/UserService';
import { useUserStore } from '../../stores/userStore';
import { useMessageStore } from '../../stores/messageStore';
import styles from './Auth.module.css';

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const { login: loginStore } = useUserStore();
  const { addMessage } = useMessageStore();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await register(formData);
      loginStore(response.token, response.user);
      
      // Mostrar mensaje de éxito y navegar a HomeScreen
      addMessage("¡Cuenta creada exitosamente! Bienvenido.", "success");
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'Error al crear la cuenta. Por favor, intente nuevamente.';
      setError(errorMessage);
      addMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Crear Cuenta</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${styles.formInput} ${error ? styles.error : ''}`}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="lastName">
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="birthDate">
              Fecha de nacimiento
            </label>
            <input
              id="birthDate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Registrar'}
            </button>
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => navigate('/')}
            >
              Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 