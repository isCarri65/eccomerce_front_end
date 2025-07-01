import React from 'react';
import styles from './CheckoutItem.module.css'; // We will create this CSS module
import { IProduct } from '../../../../types/Product/IProduct';
import { IProductGallery } from '../../../../types/Product/IProductGallery';
import { IColor } from '../../../../types/Color/IColor';
import { ISize } from '../../../../types/Size/ISize';




interface CheckoutItemProps {
  item: IProduct;
  image: IProductGallery | undefined | null;
  size: ISize;
  color: IColor;
  quantity: number;
}

const CheckoutItem: React.FC<CheckoutItemProps> = ({ item, image, size, color, quantity }) => {
  return (
    <li className={styles.checkoutItem}>
      <div className={styles.itemImage}>
        {/* Placeholder for product image - replace with actual image source */}
        <img src={image?.image || "placeholder-image.jpg"} alt={item.name} />
      </div>
      <div className={styles.itemInfo}>
        <div className={styles.itemDetails}>
          <h4>{item.name}</h4>
          <p>Talle: {size.name} Color: {color.name}</p>
          <p>Cantidad: {quantity}</p>
        </div>
        <div className={styles.itemPrice}>
          ${(item.sellPrice * quantity).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
        </div>
      </div>
    </li>
  );
};

export default CheckoutItem;