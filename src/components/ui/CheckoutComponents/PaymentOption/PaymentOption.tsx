import React from 'react';
import styles from './PaymentOption.module.css';

interface PaymentOptionsProps {
  // Define props here if any
}

const PaymentOptions: React.FC<PaymentOptionsProps> = () => {
  return (
    <div className={styles.container}>
      <h3>Opciones de Pago</h3>
      <div className={styles.optionsList}>
        <button
          className={`${styles.paymentButton} ${styles.disabledButton}`}
          disabled
          title="Temporalmente desactivado"
        >
          Tarjeta
        </button>
        <button
          className={`${styles.paymentButton} ${styles.disabledButton}`}
          disabled
          title="Temporalmente desactivado"
        >
          Presencial
        </button>
        <button className={styles.paymentButton}>
          MercadoPago
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
