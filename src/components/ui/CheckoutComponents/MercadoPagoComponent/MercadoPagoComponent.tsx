import React, { useState } from 'react';
import styles from './MercadoPagoComponent.module.css';
import { IProduct } from '../../../../types/Product/IProduct';
import { IUser } from '../../../../types/User/IUser';
import { ISize } from '../../../../types/Size/ISize';
import { IColor } from '../../../../types/Color/IColor';
import { Address } from '../../../../types/Address/IAddress';
import axios from 'axios';

interface CartItem {
  product: IProduct;
  size: ISize;
  color: IColor;
  quantity: number;
  discountPercentage?: number;
}

interface MercadoPagoSectionProps {
  cartItems: CartItem[];
  user: IUser | null;
  showSummary: boolean;
  toggleSummary: Function;
  address: Address | null;
}

const MercadoPagoSection: React.FC<MercadoPagoSectionProps> = ({ cartItems, user, showSummary, toggleSummary, address }) => {
  const BASEURL = "http://localhost:8081/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayWithMercadoPagoClick = () => {
    toggleSummary(true);
  };

  const handleCancelarClick = () => {
    toggleSummary(false);
  };

  const handlePayment = async () => {
    if (!user) {
      setError("User data is missing.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const variantPromises = cartItems.map(item =>
        axios.post(`${BASEURL}api/produtVariants`, {
          quantity: item.quantity,
          state: true,
          product: { id: item.product.id },
          size: { id: item.size.id },
          color: { id: item.color.id },
        })
      );

      const variantResponses = await Promise.all(variantPromises);
      const productos = variantResponses.map((response, index) => ({
        variantId: response.data.id,
        discountId: null // Ajustar si tienes lógica de descuentos
      }));

      const paymentData = {
        productos,
        idUser: user.id,
      };

      const paymentResponse = await axios.post('/pay/mp', paymentData);
      console.log('Mercado Pago payment initiated:', paymentResponse.data);
      // Redirigir o manejar respuesta
    } catch (err) {
      console.error('Error during payment process:', err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const basePrice = item.product.sellPrice * item.quantity;
      const discount = item.discountPercentage || 0;
      const finalPrice = basePrice * (1 - discount / 100.0);
      return acc + finalPrice;
    }, 0).toFixed(2);
  };

  return (
    <div className={styles.mercadoPagoContainer}>
      {!showSummary && (
        <button className={styles.mercadoPagoButton} onClick={handlePayWithMercadoPagoClick}>
          Pagar con Mercado Pago
        </button>
      )}

      {showSummary && (
        <div className={styles.summaryContainer}>
          <div>
            <h2>Resumen del Pedido</h2>
            {cartItems.length > 0 && user ? (
              <>
                {cartItems.map((item, idx) => (
                  <div key={idx}>
                    <p>Producto: {item.product.name}</p>
                    <p>Talla: {item.size.name}, Color: {item.color.name}</p>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                ))}
                <p>Dirección: {address?.street}, {address?.province}</p>
                <p>Total: ${calculateTotal()}</p>
              </>
            ) : <p>Cargando resumen...</p>}
          </div>
          <button className={styles.payButton} onClick={handlePayment} disabled={loading}>
            {loading ? 'Procesando...' : 'Pagar'}
          </button>
          <button className={styles.cancelButton} onClick={handleCancelarClick}>Cancelar</button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MercadoPagoSection;
