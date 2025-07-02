import React, { useEffect, useState } from 'react';
import styles from './CartSidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ElementsHTML/Button';
import { useUserStore } from '../../../stores/userStore';
import { getProductVariantsByProductId } from '../../../api/services/ProductService';

interface CartItem {
  productVariantId: number;
  productId: number;
  name: string;
  price: number;
  sizeName: string;
  quantity: number;
  colorName: string;
}

interface CartSidebarProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ showCart, setShowCart }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { } = useUserStore();
  const navigate = useNavigate();

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
                const variant = await getProductVariantsByProductId(item.productVariantId);
                return {
                  productVariantId: variant.id,
                  productId: variant.productId,
                  name: variant.productName,
                  price: variant.price,
                  sizeName: variant.sizeDTO.value,
                  colorName: variant.colorDTO.name,
                  quantity: item.quantity
                };
              })
            );

            setCartItems(itemsWithDetails);
          } catch (err) {
            console.error('Error fetching product variant details', err);
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

  const handleQuantityChange = (productVariantId: number, quantity: number) => {
    const updatedItems = cartItems.map(item =>
      item.productVariantId === productVariantId
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

  const handleDeleteItem = (productVariantId: number) => {
    const updatedItems = cartItems.filter(item => item.productVariantId !== productVariantId);
    setCartItems(updatedItems);
    sessionStorage.setItem('cart', JSON.stringify(updatedItems.map(({ sizeName, colorName, ...rest }) => rest)));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const checkoutHandle = () => {
    const checkoutItems = cartItems.map(item => ({
      productVariantId: item.productVariantId,
      quantity: item.quantity
    }));

    sessionStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
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
                <li key={item.productVariantId} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={"placeholder.jpg"} alt={item.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemDetails}>
                      <div>
                        <h4>{item.name}</h4>
                        <p>Talle: {item.sizeName} Color: {item.colorName}</p>
                      </div>
                      <button className={styles.deleteButton} onClick={() => handleDeleteItem(item.productVariantId)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantitySelector}>
                        <button onClick={() => handleQuantityChange(item.productVariantId, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productVariantId, item.quantity + 1)}>+</button>
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
