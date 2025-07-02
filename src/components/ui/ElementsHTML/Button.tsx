import { ButtonHTMLAttributes } from 'react';
import styles from './button.module.css';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) => {

  return (
    <button
      className={styles.button}
      {...props}
    >
      {children}
    </button>
  );
}; 