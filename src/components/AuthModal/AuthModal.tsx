import { useState } from "react";
import styles from "./AuthModal.module.css";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { User } from "../../types/User/authTypes";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal = ({ isOpen, onClose, onLoginSuccess }: Props) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        {isLogin ? (
          <>
            <h2 className={styles.title}>Iniciar Sesión</h2>
            <LoginForm onSwitch={() => setIsLogin(false)} onLoginSuccess={onLoginSuccess} />
          </>
        ) : (
          <>
            <h2 className={styles.title}>Registrarse</h2>
            <RegisterForm onSwitch={() => setIsLogin(true)} onRegisterSuccess={onLoginSuccess} />
          </>
        )}
      </div>
    </div>
  );
};
