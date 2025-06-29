import { useEffect, useState } from 'react';
import styles from './MessageToast.module.css';

interface MessageToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  style?: React.CSSProperties;
}

export const MessageToast = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 5000,
  style
}: MessageToastProps) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(onClose, 300); // Esperar a que termine la animación
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      className={`${styles.toast} ${styles[type]} ${isShowing ? styles.show : styles.hide}`}
      style={style}
    >
      <div className={styles.icon}>
        {type === 'success' ? '✓' : '✕'}
      </div>
      <div className={styles.message}>{message}</div>
      <button className={styles.closeButton} onClick={() => {
        setIsShowing(false);
        setTimeout(onClose, 300);
      }}>
        ×
      </button>
    </div>
  );
}; 