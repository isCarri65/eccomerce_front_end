import React, { useEffect, useState } from 'react';
import styles from './CheckoutScreen.module.css';
import ShippingAddress from '../../ui/CheckoutComponents/ShippingAdress/ShippingAddress';
import PaymentOptions from '../../ui/CheckoutComponents/PaymentOption/PaymentOption';
import MercadoPagoSection from '../../ui/CheckoutComponents/MercadoPagoComponent/MercadoPagoComponent';
import { getUserProfile } from '../../../api/services/UserService';
import { getAllAddresses } from '../../../api/services/AddressService';
import { getProductById } from '../../../api/services/ProductService';
import { getSizeById } from '../../../api/services/SizeService';
import { getColorById } from '../../../api/services/ColorService';
import { IProductGallery } from '../../../types/Product/IProductGallery';

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

const CheckoutScreen: React.FC = () => {
  const [activeStep, setActiveStep] = useState<'shippingAddress' | 'payment'>('shippingAddress');
  const [showSummary, setShowSummary] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [address, setAddress] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMp, setShowMp] = useState(false);

  useEffect(() => {
    const checkoutItems = JSON.parse(sessionStorage.getItem('checkoutItems') || '[]');

    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await getUserProfile();
        setUser(userRes);

        const addresses = await getAllAddresses();
        setAddress(addresses[0] ?? null);

        // Mapeo con estructura igual al cart
        const items: CartItem[] = await Promise.all(
          checkoutItems.map(async (item: any) => {
            const [product, size, color] = await Promise.all([
              getProductById(item.productId),
              getSizeById(item.sizeId),
              getColorById(item.colorId),
            ]);
            return {
              productId: item.productId,
              name: product.name,
              price: product.price,
              sizeId: item.sizeId,
              sizeName: size.value,
              colorId: item.colorId,
              colorName: color.name,
              quantity: item.quantity,
              imagen: product.productGalleries,
              descuento: product.discountPercentage
            };
          })
        );

        setCartItems(items);
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError('Error al cargar los datos del pedido.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSubtotal = () => {
  return cartItems.reduce((total, item) => {
    const hasDiscount = item.descuento && item.descuento > 0;
    const priceAfterDiscount = hasDiscount
      ? item.price * (1 - item.descuento / 100)
      : item.price;
    return total + priceAfterDiscount * item.quantity;
  }, 0).toFixed(2);
};


  const subtotal = calculateSubtotal();
  const shippingCost = 0;
  const total = (parseFloat(subtotal) + shippingCost).toFixed(2);

  const handleShowMp =()=>{
    setShowMp(!showMp)
  }
  const handleAddressConfirmed = () => setActiveStep('payment');
  const handleSectionHeaderClick = (step: 'shippingAddress' | 'payment') => {
    if (activeStep !== step) setActiveStep(step);
  };
  const toggleSummary = () => setShowSummary(!showSummary);

  if (loading) return <div>Cargando datos del pedido...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.infoSection}>
        <div className={`${styles.checkoutSection} ${activeStep === 'shippingAddress' ? styles.active : ''}`}>
          <div className={styles.sectionHeader} onClick={() => handleSectionHeaderClick('shippingAddress')}>
            <span className={styles.stepNumber}>1</span>
            <h3>Dirección de Envío</h3>
          </div>
          {activeStep === 'shippingAddress' && (
            <div className={styles.sectionContent}>
              <ShippingAddress onAddressConfirmed={handleAddressConfirmed} user={user} address={address} />
            </div>
          )}
        </div>

        <div className={`${styles.checkoutSection} ${activeStep === 'payment' ? styles.active : ''}`}>
          <div className={styles.sectionHeader} onClick={() => handleSectionHeaderClick('payment')}>
            <span className={styles.stepNumber}>2</span>
            <h3>Pago</h3>
          </div>
          {activeStep === 'payment' && (
            <div className={styles.sectionContent}>
              <PaymentOptions handleShowMp ={handleShowMp} />
              {showMp ?

                  <div className={styles.paymentMethodOption}>
                    <h4>Mercado Pago</h4>
                      <MercadoPagoSection
                        showSummary={showSummary}
                        toggleSummary={toggleSummary}
                        user={user}
                        address={address}
                        cartItems={cartItems}
                        />
                  </div>
                : ""  
              }
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
                <div><strong>{item.name}</strong></div>
                <img src={item.imagen.imageUrl} alt={item.name} />
              </div>
              <div>Talle: {item.sizeName}</div>
              <div>Color: {item.colorName}</div>
              <div>Cantidad: {item.quantity}</div>
              {item.descuento && item.descuento > 0 ? (
                <>
                  <div>
                    Precio unitario: <s>${item.price.toFixed(2)}</s>{' '}
                    <strong>
                      ${(item.price * (1 - item.descuento / 100)).toFixed(2)}
                    </strong>
                  </div>
                </>
              ) : (
                <div>Precio unitario: ${item.price.toFixed(2)}</div>
              )}
              <div>
                Subtotal: $
                {(
                  (item.descuento && item.descuento > 0
                    ? item.price * (1 - item.descuento / 100)
                    : item.price) * item.quantity
                ).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summaryDetails}>
          <p>Subtotal: <span>${subtotal}</span></p>
          <p>Costo de Envío: <span>${shippingCost.toFixed(2)}</span></p>
          <p>Total: <span>${total}</span></p>
        </div>
        <div className={styles.discountSection}>
          <input type="text" placeholder="Ingresá tu código de descuento aquí" />
        </div>
        <div className={styles.backToCart}>
          <a href="#">Volver al carrito</a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
