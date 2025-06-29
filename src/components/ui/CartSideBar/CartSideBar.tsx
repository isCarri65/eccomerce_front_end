import React, { useEffect, useState } from 'react';
import styles from './CartSidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ElementsHTML/Button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  color: string;
}

interface CartSidebarProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

// Mock API service
const mockApi = {
  getProductsByIds: async (ids: string[]): Promise<CartItem[]> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Mock data - replace with your actual product fetching logic
    const allProducts: CartItem[] = [
      { id: '1', name: 'Product A', price: 25.99, size: 'M', quantity: 1, color: 'Red' },
      { id: '2', name: 'Product B', price: 49.99, size: 'L', quantity: 1, color: 'Blue' },
      { id: '3', name: 'Product C', price: 15.00, size: 'S', quantity: 2, color: 'Green' },
    ];
    return allProducts.filter(product => ids.includes(product.id));
  },
};

export const CartSidebar: React.FC<CartSidebarProps> = ({ showCart, setShowCart }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  if (showCart) {
    setLoading(true);
    const storedItems = sessionStorage.getItem('cartItems');
    if (storedItems) {
      const storedData = JSON.parse(storedItems); // array de objetos
      const itemIds = storedData.map((item: any) => item.id); // obtenemos los IDs

      if (itemIds.length > 0) {
        mockApi.getProductsByIds(itemIds).then(products => {
          const itemsWithDetails = products.map(product => {
            const storedItemData = storedData.find((item: any) => item.id === product.id);
            return {
              ...product,
              quantity: storedItemData?.quantity || 1,
              size: storedItemData?.size || 'N/A',
              color: storedItemData?.color || 'N/A',
            };
          });

          setCartItems(itemsWithDetails);
          setLoading(false);
        });
      } else {
        setCartItems([]);
        setLoading(false);
      }
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }
}, [showCart]);


  const handleQuantityChange = (id: string, quantity: number) => {
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    setCartItems(updatedItems);
    // Also update sessionStorage
    const updatedStoredItems = JSON.stringify(updatedItems.map(item => ({ id: item.id, quantity: item.quantity, size: item.size, color: item.color })));
    sessionStorage.setItem('cartItems', updatedStoredItems);
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleGoToProducts = () => {
    setShowCart(false);
    navigate('/productsCatalog'); // Replace with your actual products page route
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    // Also update sessionStorage
    const updatedStoredItems = JSON.stringify(updatedItems.map(item => ({ id: item.id, quantity: item.quantity, size: item.size, color: item.color })));
    sessionStorage.setItem('cartItems', updatedStoredItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const checkoutHandle = ()=>{
    setShowCart(false)
    navigate("/checkout")
  }

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
                <li key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={/*item.image */"asd"} alt={item.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemDetails}>
                        <div>
                      <h4>{item.name}</h4>
                      <p>Talle: {item.size} Color: {item.color}</p>
                        </div>
                      <button className={styles.deleteButton} onClick={() => handleDeleteItem(item.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantitySelector}>
                        <button className={styles.minorButtonQuantity} onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button className={styles.mayorButtonQuantity} onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className={styles.itemPrice}>
                        ${(item.price * item.quantity).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
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
