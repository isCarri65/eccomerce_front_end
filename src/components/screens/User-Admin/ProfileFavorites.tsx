import React, { useEffect, useState } from 'react';
import styles from './ProfileFavorites.module.css';
import { FaStar } from 'react-icons/fa';
// import { getFavorite, updateFavorite } from '../../api/services/FavoriteService';

interface Product {
  id: number;
  name: string;
  sellPrice: number;
  description: string;
  isFavorite: boolean;
}

export const ProfileFavorites: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [changed, setChanged] = useState<{[id:number]: boolean}>({});

  useEffect(() => {
    // Simulación de llamada a getFavorite
    setProducts([
      { id: 1, name: 'Nike Air Max', sellPrice: 120, description: 'Zapatillas deportivas de alta calidad.', isFavorite: true },
      { id: 2, name: 'Adidas Run', sellPrice: 90, description: 'Ideales para correr.', isFavorite: true },
    ]);
    // En producción: getFavorite().then(setProducts)
    return () => {
      // Aquí se llamaría a updateFavorite para cada producto cambiado
      // Object.entries(changed).forEach(([id, state]) => {
      //   if (!state) updateFavorite({ id_product: id, id_user, state: false })
      // })
    };
  }, []);

  const toggleFavorite = (id: number) => {
    setProducts(products => products.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    setChanged(ch => ({ ...ch, [id]: !products.find(p => p.id === id)?.isFavorite }));
  };

  return (
    <div className={styles.favoritesContainer}>
      <h2 className={styles.title}>Favoritos</h2>
      <div className={styles.productsList}>
        {products.map(product => (
          <div className={styles.productCard} key={product.id}>
            <div className={styles.productHeader}>
              <span className={styles.productName}>{product.name}</span>
              <FaStar
                className={product.isFavorite ? styles.starActive : styles.starInactive}
                onClick={() => toggleFavorite(product.id)}
                size={28}
              />
            </div>
            <div className={styles.productPrice}>${product.sellPrice}</div>
            <div className={styles.productDesc}>{product.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}; 