import React, { useEffect, useState } from "react";
import styles from "./CartSidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../ElementsHTML/Button";
import { getProductVariantCartById } from "../../../api/services/ProductService";
import { IProductVariantCART } from "../../../types/Product/IProductVariantCART";
import { cartStore } from "../../../stores/cartStore";

interface CartItem {
  productVariantId: number;
  quantity: number;
}

interface CartSidebarProps {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  showCart,
  setShowCart,
}) => {
  const [cartItems, setCartItems] = useState<IProductVariantCART[]>([]);
  const [storedItems, setStoredItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const setItemsChecked = cartStore((state) => state.setItemsChecked);
  const navigate = useNavigate();

  const getStoredItems = (): CartItem[] => {
    const jsonItems = sessionStorage.getItem("cart");
    if (jsonItems) {
      const storedItems2: CartItem[] = JSON.parse(jsonItems);
      setStoredItems(storedItems2);
      return storedItems2;
    } else {
      setCartItems([]);
      setLoading(false);
      return [];
    }
  };
  const fetchData = async () => {
    const items = getStoredItems();
    try {
      const itemsWithDetails = await Promise.all(
        items.map(async (item: CartItem) => {
          const variants: IProductVariantCART = await getProductVariantCartById(
            item.productVariantId
          );
          console.log("variant");
          const variantCart: IProductVariantCART = {
            id: variants.id,
            productList: variants.productList,
            size: variants.size,
            color: variants.color,
            stock: variants.stock,
            state: variants.state,
            quantity: item.quantity,
          };
          console.log("Item ", variantCart);
          return variantCart;
        })
      );

      setCartItems(itemsWithDetails);
      console.log("items con detalles", itemsWithDetails);
    } catch (err) {
      console.error("Error fetching product variant details", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showCart) {
      setLoading(true);
      fetchData();
    }
  }, [showCart]);
  useEffect(() => {
    console.log("Store items updated:", storedItems);
    console.log("Cart Items", cartItems);
  }, [cartItems]);

  const handleQuantityChange = (productVariantId: number, quantity: number) => {
    const updatedItems = cartItems.map((item) =>
      item.id === productVariantId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    const updatedStoredItems = storedItems.map((item) =>
      item.productVariantId === productVariantId
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    setCartItems(updatedItems);
    setStoredItems(updatedStoredItems);
    sessionStorage.setItem("cart", JSON.stringify(updatedStoredItems));
  };

  const handleCloseCart = () => {
    setShowCart(false);
  };

  const handleGoToProducts = () => {
    setShowCart(false);
    navigate("/productsCatalog");
  };

  const handleDeleteItem = (productVariantId: number) => {
    const updatedItems = cartItems.filter(
      (item) => item.id !== productVariantId
    );
    const updatedStoredItems = storedItems.filter(
      (item) => item.productVariantId !== productVariantId
    );
    setCartItems(updatedItems);
    sessionStorage.setItem("cart", JSON.stringify(updatedStoredItems));
  };

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) => total + item.productList.price * item.quantity,
        0
      )
      .toFixed(2);
  };

  const checkoutHandle = () => {
    setItemsChecked(cartItems);
    setShowCart(false);
    navigate("/checkout");
  };

  return (
    <div className={`${styles.cartSidebar} ${showCart ? styles.open : ""}`}>
      <div className={styles.cartHeader}>
        <h2>Tu Carrito</h2>
        <FontAwesomeIcon
          icon={faTimes}
          className={styles.closeButton}
          onClick={handleCloseCart}
        />
      </div>
      <div className={styles.content}>
        {loading ? (
          <p>Cargando carrito...</p>
        ) : cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Tu carrito está vacío.</p>
            <button
              className={styles.shopNowButton}
              onClick={handleGoToProducts}
            >
              Comprar ahora
            </button>
          </div>
        ) : (
          <>
            <ul className={styles.cartItemList}>
              {cartItems.map((item) => (
                <li key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img
                      src={item.productList.imageUrl}
                      alt={item.productList.name}
                    />
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemDetails}>
                      <div>
                        <h4>{item.productList.name}</h4>
                        <p>
                          Talle: {item.size.name} Color: {item.color.name}
                        </p>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantitySelector}>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className={styles.itemPrice}>
                        ${(item.productList.price * item.quantity).toFixed(2)}
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
              <Button onClick={checkoutHandle}>Comprar</Button>
            </div>
            <div className={styles.bottomLinks}>
              <Link
                to="#"
                className={styles.bottomLinks}
                onClick={handleCloseCart}
              >
                &lt; Seguir comprando
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
