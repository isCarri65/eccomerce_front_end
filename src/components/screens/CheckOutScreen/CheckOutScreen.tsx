import React, { useEffect, useState } from 'react';
import styles from './CheckoutScreen.module.css';
import CheckoutItem from '../../ui/CheckoutComponents/CheckoutItem/CheckoutItem';
import ShippingAddress from '../../ui/CheckoutComponents/ShippingAdress/ShippingAddress'; // Import ShippingAddress
import PaymentOptions from '../../ui/CheckoutComponents/PaymentOption/PaymentOption';
import axios from 'axios';
import MercadoPagoSection from '../../ui/CheckoutComponents/MercadoPagoComponent/MercadoPagoComponent';
import { IProduct } from '../../../types/Product/IProduct';
import { IUser } from '../../../types/User/IUser';
import { ISize } from '../../../types/Size/ISize';
import { IColor } from '../../../types/Color/IColor'
import { IProductGallery } from '../../../types/Product/IProductGallery';
import { Address } from '../../../types/Address/IAddress';



interface CheckoutScreenProps {
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = () => {
  const BASEURL = "http://localhost:8080/"
  // State to manage the current active step in the checkout process
  const [activeStep, setActiveStep] = useState<'shippingAddress' | 'payment'>('shippingAddress');

  // State to manage the visibility of the Mercado Pago summary
  const [showSummary, setShowSummary] = useState(false);

  // State to store fetched data
  const [product, setProduct] = useState<IProduct | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [size, setSize] = useState<ISize | null>(null);
  const [color, setColor] = useState<IColor | null>(null);
  const [productGallery, setProductGallery] = useState<IProductGallery | null>(null);
  const [address, setAddress] = useState<Address | null>(null);


  const [quantity, setQuantity] = useState<number>(0);
  


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product, user, size, color, and quantity data from sessionStorage and API
  useEffect(() => {
    const productId = sessionStorage.getItem('productId');
    const sizeId = sessionStorage.getItem('sizeId');
    const colorId = sessionStorage.getItem('colorId');
    const storedQuantity = sessionStorage.getItem('quantity');


    if (storedQuantity) {
        setQuantity(parseInt(storedQuantity, 10));
    }


    const fetchCheckoutData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productResponse = await axios.get(`${BASEURL}api/public/products/${productId}`);
        setProduct(productResponse.data as IProduct);

        const userResponse = await axios.get(`${BASEURL}api/protected/profile`);
        setUser(userResponse.data as IUser);

        const sizeResponse = await axios.get(`${BASEURL}api/public/sizes/${sizeId}`);
        setSize(sizeResponse.data as ISize);

        const colorResponse = await axios.get(`${BASEURL}api/public/colors/${colorId}`);
        setColor(colorResponse.data as IColor);

        const productGalleryResponse = await axios.get(`${BASEURL}api/public/productgalleries/product/${productId}`);
        setProductGallery(productGalleryResponse.data as IProductGallery);
        
        const addressResponse = await axios.get(`${BASEURL}api/protected/addresses/getAll`);
        setAddress(addressResponse.data as Address);

      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError('Error al cargar los datos del pedido.');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []); // Empty dependency array means this effect runs once on mount

    const calculateSubtotal = () => {
      if (product) {
          return (product.sellPrice * quantity).toFixed(2);
      }
      return (0).toFixed(2);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 0; // Hardcoded shipping cost for now
  const total = (parseFloat(subtotal) + shippingCost).toFixed(2);

  // Function to handle address confirmation and move to the payment step
  const handleAddressConfirmed = (useCurrent: boolean) => {
    console.log('Address confirmed. Using current address:', useCurrent);
    setActiveStep('payment'); // Move to the payment step and collapse current
  };

  // Function to handle clicking on a section header to expand it
  const handleSectionHeaderClick = (step: 'shippingAddress' | 'payment') => {
      // Only allow expanding if it's not the current active step
     if (activeStep !== step) {
        setActiveStep(step);
     }
  };

  // Function to toggle Mercado Pago summary visibility
  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };


  return (
    <div className={styles.container}>
      <div className={styles.infoSection}>
        {/* Shipping Address Section */}
        <div className={`${styles.checkoutSection} ${activeStep === 'shippingAddress' ? styles.active : ''}`}>
          <div
             className={styles.sectionHeader}
             onClick={() => handleSectionHeaderClick('shippingAddress')} // Add click handler
          >
            <span className={styles.stepNumber}>1</span>
            <h3>Dirección de Envío</h3>
          </div>
          {activeStep === 'shippingAddress' && (
            <div className={styles.sectionContent}>
              <ShippingAddress onAddressConfirmed={handleAddressConfirmed} user={user} address={address} />
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className={`${styles.checkoutSection} ${activeStep === 'payment' ? styles.active : ''}`}>
           <div
              className={styles.sectionHeader}
              onClick={() => handleSectionHeaderClick('payment')} // Add click handler
            >
            <span className={styles.stepNumber}>2</span>
            <h3>Pago</h3>
          </div>
          {activeStep === 'payment' && (
             <div className={styles.sectionContent}>
                <PaymentOptions />
                <div className={styles.paymentMethodOption}>
                   <div className={styles.paymentMethodHeader}>
                       <h4>Mercado Pago</h4>
                   </div>
                   {loading && <p>Cargando datos del pedido...</p>}
                   {error && <p>Error al cargar los datos del pedido: {error}</p>}
                   {!loading && !error && product && user && size && color && (
                     <MercadoPagoSection
                       showSummary={showSummary}
                       toggleSummary={toggleSummary}
                       product={product}
                       user={user}
                       size={size}
                       color={color}
                       address={address}
                     />
                   )}
               </div>
             </div>
          )}
        </div>

        {/* You can add more sections here following the same pattern */}
      </div>
      <div className={styles.orderSummary}>
        <h3>Resumen del Pedido</h3>
        <div className={styles.itemList}>
           {/* Display fetched product data instead of mockCartItems */}
           {product && size && color && quantity > 0 && (
                <CheckoutItem
                    key={product.id}
                    item={{
                        id: product.id,
                        name: product.name,
                        sellPrice: product.sellPrice,
                        buyPrice: product.buyPrice,
                        description: product.description,
                        state: product.state,
                        genre: product.genre,
                        categories: product.categories
                    }}
                    image={productGallery}
                    size={size}
                    color={color}
                    quantity={quantity}
                />
           )}
        </div>
        <div className={styles.summaryDetails}>
          <p>Subtotal: <span>${subtotal}</span></p>
          <p>Costo de Envío: <span>${shippingCost.toFixed(2)}</span></p>
          <p>Total: <span>${total}</span></p>
        </div>
         {/* Discount Code Section Placeholder */}
        <div className={styles.discountSection}>
            {/* Input for discount code would go here */}
            <input type="text" placeholder="Ingresá tu código de descuento aquí" />
            {/* Button to apply discount */}
        </div>
         <div className={styles.backToCart}>
            {/* Link to go back to the cart */}
            <a href="#">Volver al carrito</a>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;
