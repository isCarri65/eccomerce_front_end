import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProductDetailScreen.module.css";
import { IProduct } from "../../../../types/Product/IProduct";
import { addToCart } from "../../../../utils/cartUtils";

// Simular talles y colores:
const sizeOptions = [
  { id: 1, label: "40" },
  { id: 2, label: "41" },
  { id: 3, label: "42" },
];
const colorOptions = [
  { id: 1, label: "Rojo" },
  { id: 2, label: "Azul" },
];

export const ProductDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState<number>(sizeOptions[0].id);
  const [selectedColor, setSelectedColor] = useState<number>(colorOptions[0].id);

  useEffect(() => { setProduct
  }, [id]);

  if (!product) return <div className={styles.loading}>Cargando producto...</div>;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      colorId: selectedColor,
      sizeId: selectedSize,
    });
    alert("¡Producto agregado al carrito!");
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftColumn}>
        <img
          src="https://via.placeholder.com/350x250?text=NIKE"
          alt={product.name}
          className={styles.mainImage}
        />
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.productName}>{product.name}</div>
        <div className={styles.productPrice}>${product.price.toLocaleString()}</div>
        <div className={styles.productDesc}>{product.description}</div>
        <div className={styles.selectors}>
          <label>
            Talle:
            <select value={selectedSize} onChange={e => setSelectedSize(Number(e.target.value))}>
              {sizeOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label>
            Color:
            <select value={selectedColor} onChange={e => setSelectedColor(Number(e.target.value))}>
              {colorOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>
        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};
