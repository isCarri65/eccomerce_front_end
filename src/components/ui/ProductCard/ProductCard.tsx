import { FC, useState } from "react";
import { IProduct } from "../../../types/Product/IProduct";
import styles from "./ProductCard.module.css";
import imageAMD from "../../../assets/homeImages/fondo pc AMD.jpg";

interface IProductCard {
  product: IProduct;
}
export const ProductCard: FC<IProductCard> = ({ product }) => {
  const [productImage, setProductImage] = useState<string | null>(null);
  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer}>
        <img
          className={styles.productImage}
          src={productImage ? productImage : imageAMD}
          alt={product.name}
        />
      </div>
      <div className={styles.productDetails}>
        <h3 className={styles.productTitle}>{product.name}</h3>
        <p className={styles.productDescription}>{product.description}</p>
        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};
