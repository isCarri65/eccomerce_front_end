import React, { useEffect, useState } from 'react';
import styles from './ProfileHistory.module.css';
import { getAllPurchaseOrdersByUserProfile } from '../../../api/services/PurcharseOrderService';

interface Purchase {
  id: number;
  name: string;
  totalPrice: number;
  quantity: number;
  date: string;
}

export const ProfileHistory: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    // Simulación de llamada real
    setPurchases([
      { id: 1, name: 'Nike Air Max', totalPrice: 240, quantity: 2, date: '2024-05-01' },
      { id: 2, name: 'Adidas Run', totalPrice: 90, quantity: 1, date: '2024-04-15' },
    ]);
    // En producción: getAllPurchaseOrdersByUserProfile().then(setPurchases)
  }, []);

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.title}>Historial de Compras</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio Final</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.name}</td>
                <td>${purchase.totalPrice}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 