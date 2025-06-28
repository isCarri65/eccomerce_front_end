import React, { useState } from 'react';
import styles from './MercadoPagoComponent.module.css';
import { IProduct } from '../../../../types/Product/IProduct';
import { IUser } from '../../../../types/User/IUser';
import { ISize } from '../../../../types/Size/ISize';
import { IColor } from '../../../../types/Color/IColor';
import { Address } from '../../../../types/Address/IAddress';
import axios from 'axios';

interface MercadoPagoSectionProps {
  product: IProduct | null;
  user: IUser | null;
  size: ISize | null;
  color: IColor | null;
  showSummary: boolean;
  toggleSummary: Function;
  address: Address | null;
}

const MercadoPagoSection: React.FC<MercadoPagoSectionProps> = ({ product, user, size, color,showSummary,toggleSummary, address }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayWithMercadoPagoClick = () => {
    toggleSummary(true);
  };

  const handlePagarClick = () => {
    // Handle payment logic here
    console.log('Pagar clicked');
  };

  const handleCancelarClick = () => {
    toggleSummary(false);
  };

  const handlePayment = () => {
    if (!product || !user || !size || !color) {
      setError("Product, user, size, or color data is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    const productVariantData = {
      quantity: 1, // Assuming quantity is 1 for now based on the summary
      state: true, // Assuming state is true
      product: { id: product.id },
      size: { id: size.id }, // Use size.id from props
      color: { id: color.id }, // Use color.id from props
    };

    axios.post('/api/produtVariants', productVariantData)
      .then(response => {
        const productVariant = response.data;

        const mercadopagoPaymentData = {
          productos: [{ variantId: productVariant.id, discountId: null }], // Assuming no discount for now
          idUser: user.id,
        };

        return axios.post('/pay/mp', mercadopagoPaymentData);
      })
      .then(response => {
        console.log('Mercado Pago payment initiated:', response.data);
        setLoading(false);
        // Redirect to Mercado Pago or handle the response as needed
      })
      .catch(error => {
        console.error('Error during payment process:', error);
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
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
            {product && user && size && color ? (
              <>
                <p>Producto: {product.name}</p>
                <p>Dirección: {address.street}, {address?.province}</p> 
                <p>Total: ${product.sellPrice * (1 - (product.discount?.percentage || 0))}</p> 
              </>
            ) : <p>Cargando resumen...</p>}
          </div>
          <button className={styles.payButton} onClick={handlePayment}>Pagar</button>
          <button className={styles.cancelButton} onClick={handleCancelarClick}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default MercadoPagoSection;