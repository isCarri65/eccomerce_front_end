import React, { useEffect, useState } from 'react';
import styles from './CheckoutScreen.module.css';
import CheckoutItem from '../../ui/CheckoutComponents/CheckoutItem/CheckoutItem';
import ShippingAddress from '../../ui/CheckoutComponents/ShippingAdress/ShippingAddress';
import PaymentOptions from '../../ui/CheckoutComponents/PaymentOption/PaymentOption';
import axios from 'axios';
import MercadoPagoSection from '../../ui/CheckoutComponents/MercadoPagoComponent/MercadoPagoComponent';
import { IProduct } from '../../../types/Product/IProduct';
import { IUser } from '../../../types/User/IUser';
import { ISize } from '../../../types/Size/ISize';
import { IColor } from '../../../types/Color/IColor';
import { IProductGallery } from '../../../types/Product/IProductGallery';
import { Address } from '../../../types/Address/IAddress';
import { IDiscount } from '../../../types/Discount/IDiscount';

interface CartItem {
  product: IProduct;
  size: ISize;
  color: IColor;
  gallery?: IProductGallery;
  quantity: number;
  discount?: IDiscount;
}

const CheckoutScreen: React.FC = () => {
  const BASEURL = "http://localhost:8081/";
  const [activeStep, setActiveStep] = useState<'shippingAddress' | 'payment'>('shippingAddress');
  const [showSummary, setShowSummary] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = sessionStorage.getItem('cart');
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await axios.get(`${BASEURL}api/protected/profile`);
        setUser(userRes.data);

        const addressRes = await axios.get(`${BASEURL}api/protected/addresses/getAll`);
        setAddress(addressRes.data[0] ?? null);

        const items: CartItem[] = await Promise.all(
          parsedCart.map(async (item: any) => {
            const [productRes, sizeRes, colorRes, discountRes, galleryRes] = await Promise.all([
              axios.get(`${BASEURL}api/public/products/${item.productId}`),
              axios.get(`${BASEURL}api/public/sizes/${item.sizeId}`),
              axios.get(`${BASEURL}api/public/colors/${item.colorId}`),
              axios.get(`${BASEURL}api/public/productdiscounts/product/${item.productId}`),
              axios.get(`${BASEURL}api/public/productgalleries/product/${item.productId}`)
            ]);

            return {
              product: productRes.data,
              size: sizeRes.data,
              color: colorRes.data,
              quantity: item.quantity,
              gallery: galleryRes.data,
              discount: discountRes.data[0]?.discount ?? null
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
    const subtotal = cartItems.reduce((total, item) => {
      const base = item.product.sellPrice * item.quantity;
      const final = item.discount ? base * (1 - item.discount.percentage / 100) : base;
      return total + final;
    }, 0);
    return subtotal.toFixed(2);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 0;
  const total = (parseFloat(subtotal) + shippingCost).toFixed(2);

  const handleAddressConfirmed = () => setActiveStep('payment');
  const handleSectionHeaderClick = (step: 'shippingAddress' | 'payment') => {
    if (activeStep !== step) setActiveStep(step);
  };
  const toggleSummary = () => setShowSummary(!showSummary);

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
              <PaymentOptions />
              <div className={styles.paymentMethodOption}>
                <h4>Mercado Pago</h4>
                {loading && <p>Cargando datos del pedido...</p>}
                {error && <p>{error}</p>}
                {!loading && !error && (
                  <MercadoPagoSection
                    showSummary={showSummary}
                    toggleSummary={toggleSummary}
                    user={user}
                    address={address}
                    cartItems={cartItems} // Nuevo prop si querés manejar múltiples productos dentro de MercadoPagoSection
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.orderSummary}>
        <h3>Resumen del Pedido</h3>
        <div className={styles.itemList}>
          {cartItems.map((item, index) => (
            <CheckoutItem
              key={index}
              item={item.product}
              image={item.gallery}
              size={item.size}
              color={item.color}
              quantity={item.quantity}
            />
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
