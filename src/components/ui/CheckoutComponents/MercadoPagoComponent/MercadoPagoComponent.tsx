import React, { useState } from "react";
import styles from "./MercadoPagoComponent.module.css";
import { IUser } from "../../../../types/User/IUser";
import { IAddress } from "../../../../types/Address/IAddress";
import { IProductGallery } from "../../../../types/Product/IProductGallery";
import axios from "axios";
import { IProductVariantCART } from "../../../../types/Product/IProductVariantCART";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  sizeId: number;
  sizeName: string;
  colorId: number;
  colorName: string;
  quantity: number;
  imagen: IProductGallery;
  descuento: number | null;
  variantId: number;
}

interface MercadoPagoSectionProps {
  cartItems: IProductVariantCART[];
  user: IUser | null;
  showSummary: boolean;
  toggleSummary: Function;
  address: IAddress | null;
}

const MercadoPagoSection: React.FC<MercadoPagoSectionProps> = ({
  cartItems,
  user,
  showSummary,
  toggleSummary,
  address,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayWithMercadoPagoClick = () => {
    toggleSummary(true);
  };

  const handleCancelarClick = () => {
    toggleSummary(false);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((acc, item) => {
        const base = item.price * item.quantity;
        const discount = item.descuento ?? 0;
        const final = base * (1 - discount / 100);
        return acc + final;
      }, 0)
      .toFixed(2);
  };

  const handlePayment = async () => {
    if (!user) {
      setError("Falta información del usuario.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Armar los datos para CompraRequestDTO
      const productos = cartItems.map((item) => ({
        variantId: item.variantId,
        discountId: item.descuento ? item.descuento : null,
      }));

      const requestData = {
        productos,
        idUser: user.id,
      };

      const response = await axios.post(
        "http://localhost:8082/pay/mp",
        requestData
      );
      const { preferenceId } = response.data;

      if (preferenceId) {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?preference_id=${preferenceId}`;
      } else {
        throw new Error("No se recibió el preferenceId de MercadoPago");
      }
    } catch (err) {
      console.error("Error en el pago:", err);
      setError("Hubo un error al iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mercadoPagoContainer}>
      {!showSummary && (
        <button
          className={styles.mercadoPagoButton}
          onClick={handlePayWithMercadoPagoClick}
        >
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
                    <p>
                      <strong>{item.name}</strong>
                    </p>
                    <p>
                      Talle: {item.sizeName} - Color: {item.colorName}
                    </p>
                    <p>Cantidad: {item.quantity}</p>
                    <p>Precio unitario: ${item.price.toFixed(2)}</p>
                    {item.descuento && <p>Descuento: {item.descuento}%</p>}
                    <p>
                      Subtotal: $
                      {(
                        item.price *
                        item.quantity *
                        (1 - (item.descuento ?? 0) / 100)
                      ).toFixed(2)}
                    </p>
                    <hr />
                  </div>
                ))}
                <p>
                  <strong>Dirección:</strong> {address?.street},{" "}
                  {address?.province}
                </p>
                <p>
                  <strong>Total: ${calculateTotal()}</strong>
                </p>
              </>
            ) : (
              <p>Cargando resumen...</p>
            )}
          </div>
          <button
            className={styles.payButton}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Pagar"}
          </button>
          <button className={styles.cancelButton} onClick={handleCancelarClick}>
            Cancelar
          </button>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MercadoPagoSection;
