import React, { useEffect, useState } from 'react';
import styles from './CheckoutScreen.module.css';
import CheckoutItem from '../../ui/CheckoutComponents/CheckoutItem/CheckoutItem';
import ShippingAddress from '../../ui/CheckoutComponents/ShippingAdress/ShippingAddress';
import PaymentOptions from '../../ui/CheckoutComponents/PaymentOption/PaymentOption';
import MercadoPagoSection from '../../ui/CheckoutComponents/MercadoPagoComponent/MercadoPagoComponent';
import { IProduct } from '../../../types/Product/IProduct';
import { IUser } from '../../../types/User/IUser';
import { ISize } from '../../../types/Size/ISize';
import { IColor } from '../../../types/Color/IColor';
import { IProductGallery } from '../../../types/Product/IProductGallery';
import { Address } from '../../../types/Address/IAddress';
import { IDiscount } from '../../../types/Discount/IDiscount';
import publicApiClient from '../../../api/interceptors/axios.publicApiClient';
import { getUserProfile } from '../../../api/services/UserService';
import { getAllAddresses } from '../../../api/services/AddressService';
import { getProductById } from '../../../services/productService';
import { getSizeById } from '../../../api/services/SizeService';
import { getColorById } from '../../../api/services/ColorService';



interface CartItem {
  product: IProduct;
  size: ISize;
  color: IColor;
  gallery?: IProductGallery;
  quantity: number;
  discount?: IDiscount;
}

const CheckoutScreen: React.FC = () => {
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

    const fetchGalleryByProductId = async (productId: number): Promise<IProductGallery> => {
      const response = await publicApiClient.get(`/public/productgalleries/product/${productId}`);
      return response.data;
    };

    const fetchDiscountByProductId = async (productId: number): Promise<IDiscount | null> => {
      const response = await publicApiClient.get(`/public/productdiscounts/product/${productId}`);
      return response.data[0]?.discount || null;
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await getUserProfile();
        setUser(userRes);

        const addresses = await getAllAddresses();
        setAddress(addresses[0] ?? null);

        const items: CartItem[] = await Promise.all(
          parsedCart.map(async (item: any) => {
            const [product, size, color, discount, gallery] = await Promise.all([
              getProductById(item.productId),
              getSizeById(item.sizeId),
              getColorById(item.colorId),
              fetchDiscountByProductId(item.productId),
              fetchGalleryByProductId(item.productId),
            ]);

            return {
              product,
              size,
              color,
              quantity: item.quantity,
              gallery,
              discount,
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
                    cartItems={cartItems}
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
