import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import { useMessageStore } from "../../stores/messageStore";
import styles from "./Auth.module.css";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { login: loginStore } = useUserStore();
  const { addMessage } = useMessageStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password);
      sessionStorage.setItem("sesionToken", response.token);
      loginStore(response.token, response.user);

      // Mostrar mensaje de éxito y navegar a HomeScreen
      addMessage("¡Inicio de sesión exitoso! Bienvenido.", "success");
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "Credenciales inválidas. Por favor, intente nuevamente.";
      setError(errorMessage);
      addMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
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
              className={`${styles.formInput} ${error ? styles.error : ""}`}
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

          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={loading}
            >
              {loading ? "Cargando..." : "Ingresar"}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => navigate("/register")}
            >
              Crear Cuenta
            </button>
            <button
              type="button"
              className={styles.outlineButton}
              onClick={() => navigate("/")}
            >
              Regresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
