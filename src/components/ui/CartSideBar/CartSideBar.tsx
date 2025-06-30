import React, { useEffect, useState } from 'react';
import styles from './CartSidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Button } from '../ElementsHTML/Button';
import { useUserStore } from '../../../stores/userStore';
import axios from 'axios';

interface CartItem {
  productId: number;
  name: string;
  price: number;
  sizeId: number;
  sizeName: string;
  quantity: number;
  colorId: number;
  colorName: string;
}

interface CartSidebarProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ showCart, setShowCart }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useUserStore();
  const navigate = useNavigate();
  const BASEURL = 'http://localhost:8081/';

  useEffect(() => {
    if (showCart) {
      setLoading(true);
      const storedItems = sessionStorage.getItem('cart');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);

        const fetchData = async () => {
          try {
            const itemsWithDetails = await Promise.all(
              parsedItems.map(async (item: any) => {
                const [productRes, sizeRes, colorRes] = await Promise.all([
                  axios.get(`${BASEURL}api/public/products/${item.productId}`),
                  axios.get(`${BASEURL}api/public/sizes/${item.sizeId}`),
                  axios.get(`${BASEURL}api/public/colors/${item.colorId}`)
                ]);

                return {
                  productId: item.productId,
                  name: productRes.data.name,
                  price: productRes.data.sellPrice,
                  sizeId: item.sizeId,
                  sizeName: sizeRes.data.name,
                  colorId: item.colorId,
                  colorName: colorRes.data.name,
                  quantity: item.quantity
                };
              })
            );

            setCartItems(itemsWithDetails);
          } catch (err) {
            console.error('Error fetching product details', err);
            setCartItems([]);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
      } else {
        setCartItems([]);
        setLoading(false);
      }
    }
  }, [showCart]);

  const handleQuantityChange = (productId: number, sizeId: number, colorId: number, quantity: number) => {
    const updatedItems = cartItems.map(item =>
      item.productId === productId && item.sizeId === sizeId && item.colorId === colorId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    setCartItems(updatedItems);
    sessionStorage.setItem('cart', JSON.stringify(updatedItems.map(({ sizeName, colorName, ...rest }) => rest)));
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleGoToProducts = () => {
    setShowCart(false);
    navigate('/productsCatalog');
  };

  const handleDeleteItem = (productId: number, sizeId: number, colorId: number) => {
    const updatedItems = cartItems.filter(
      item => !(item.productId === productId && item.sizeId === sizeId && item.colorId === colorId)
    );
    setCartItems(updatedItems);
    sessionStorage.setItem('cart', JSON.stringify(updatedItems.map(({ sizeName, colorName, ...rest }) => rest)));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const checkoutHandle = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    setShowCart(false);
    navigate('/checkout');
  };

  return (
    <div className={`${styles.cartSidebar} ${showCart ? styles.open : ''}`}>
      <div className={styles.cartHeader}>
        <h2>Your Cart</h2>
        <FontAwesomeIcon icon={faTimes} className={styles.closeButton} onClick={handleCloseCart} />
      </div>
      <div className={styles.content}>
        {loading ? (
          <p>Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Your cart is empty.</p>
            <button className={styles.shopNowButton} onClick={handleGoToProducts}>
              Shop Now
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.cartItemList}>
              {cartItems.map(item => (
                <li key={`${item.productId}-${item.sizeId}-${item.colorId}`} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={"placeholder.jpg"} alt={item.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemDetails}>
                      <div>
                        <h4>{item.name}</h4>
                        <p>Talle: {item.sizeName} Color: {item.colorName}</p>
                      </div>
                      <button className={styles.deleteButton} onClick={() => handleDeleteItem(item.productId, item.sizeId, item.colorId)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantitySelector}>
                        <button onClick={() => handleQuantityChange(item.productId, item.sizeId, item.colorId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId, item.sizeId, item.colorId, item.quantity + 1)}>+</button>
                      </div>
                      <div className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.cartSummary}>
              <div className={styles.total}>
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              <Button onClick={checkoutHandle}>Checkout</Button>
            </div>
            <div className={styles.bottomLinks}>
              <Link to="#" className={styles.bottomLinks} onClick={handleCloseCart}>&lt; Seguir comprando</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
