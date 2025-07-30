import React, { useEffect, useState } from "react";
import styles from "./CheckoutScreen.module.css";
import ShippingAddress from "../../ui/CheckoutComponents/ShippingAdress/ShippingAddress";
import PaymentOptions from "../../ui/CheckoutComponents/PaymentOption/PaymentOption";
import MercadoPagoSection from "../../ui/CheckoutComponents/MercadoPagoComponent/MercadoPagoComponent";
import { getUserProfileAddresses } from "../../../api/services/UserService";
import { cartStore } from "../../../stores/cartStore";
import { IProductVariantCART } from "../../../types/Product/IProductVariantCART";
import { useUsers } from "../../../hooks/useUsers";
import { IAddress } from "../../../types/Address/IAddress";
import { useAddresses } from "../../../hooks/useAddress";

const CheckoutScreen: React.FC = () => {
  const [activeStep, setActiveStep] = useState<"shippingAddress" | "payment">(
    "shippingAddress"
  );
  const [showSummary, setShowSummary] = useState(false);
  const [cartItems, setCartItems] = useState<IProductVariantCART[]>([]);
  const { currentUserProfile } = useUsers();
  const [addresses, setAddresses] = useState<IAddress[] | null>(null);
  const { selectedAddress } = useAddresses();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMp, setShowMp] = useState(false);
  const itemsChecked = cartStore((state) => state.itemsChecked);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const addresses = await getUserProfileAddresses();
        setAddresses(addresses);

        setCartItems(itemsChecked);
      } catch (err) {
        console.error("Error fetching checkout data:", err);
        setError("Error al cargar los datos del pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + item.productList.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 0;
  const total = (parseFloat(subtotal) + shippingCost).toFixed(2);

  const handleShowMp = () => {
    setShowMp(!showMp);
  };
  const handleAddressConfirmed = () => setActiveStep("payment");
  const handleSectionHeaderClick = (step: "shippingAddress" | "payment") => {
    if (activeStep !== step) setActiveStep(step);
  };
  const toggleSummary = () => setShowSummary(!showSummary);

  if (loading) return <div>Cargando datos del pedido...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.infoSection}>
        <div
          className={`${styles.checkoutSection} ${
            activeStep === "shippingAddress" ? styles.active : ""
          }`}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => handleSectionHeaderClick("shippingAddress")}
          >
            <span className={styles.stepNumber}>1</span>
            <h3>Dirección de Envío</h3>
          </div>
          {activeStep === "shippingAddress" && (
            <div className={styles.sectionContent}>
              <ShippingAddress
                onAddressConfirmed={handleAddressConfirmed}
                user={currentUserProfile}
                addresses={addresses}
              />
            </div>
          )}
        </div>

        <div
          className={`${styles.checkoutSection} ${
            activeStep === "payment" ? styles.active : ""
          }`}
        >
          <div
            className={styles.sectionHeader}
            onClick={() => handleSectionHeaderClick("payment")}
          >
            <span className={styles.stepNumber}>2</span>
            <h3>Pago</h3>
          </div>
          {activeStep === "payment" && (
            <div className={styles.sectionContent}>
              <PaymentOptions handleShowMp={handleShowMp} />
              {showMp ? (
                <div className={styles.paymentMethodOption}>
                  <h4>Mercado Pago</h4>
                  <MercadoPagoSection
                    showSummary={showSummary}
                    toggleSummary={toggleSummary}
                    user={currentUserProfile}
                    address={selectedAddress}
                    cartItems={cartItems}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.orderSummary}>
        <h3>Resumen del Pedido</h3>
        <div className={styles.itemList}>
          {cartItems.map((item, index) => (
            <div key={index} className={styles.checkoutItemSummary}>
              <div>
                <div>
                  <strong>{item.productList.name}</strong>
                </div>
                <img
                  src={item.productList.imageUrl}
                  alt={item.productList.name}
                />
              </div>
              <div>Talle: {item.size.name}</div>
              <div>Color: {item.color.name}</div>
              <div>Cantidad: {item.quantity}</div>
              {item.productList.discountPercentage &&
              item.productList.discountPercentage > 0 ? (
                <>
                  <div>
                    Precio unitario:{" "}
                    <s>${item.productList.originalPrice.toFixed(2)}</s>{" "}
                    <strong>${item.productList.price.toFixed(2)}</strong>
                  </div>
                </>
              ) : (
                <div>Precio unitario: ${item.productList.price.toFixed(2)}</div>
              )}
              <div>
                Subtotal: ${(item.productList.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summaryDetails}>
          <p>
            Subtotal: <span>${subtotal}</span>
          </p>
          <p>
            Costo de Envío: <span>${shippingCost.toFixed(2)}</span>
          </p>
          <p>
            Total: <span>${total}</span>
          </p>
        </div>
        <div className={styles.discountSection}>
          <input
            type="text"
            placeholder="Ingresá tu código de descuento aquí"
          />
        </div>
        <div className={styles.backToCart}>
          <a href="#">Volver al carrito</a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
