import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProductDetailScreen.module.css";
import { IProduct } from "../../../../types/Product/IProduct";
import { ProductGenre } from "../../../../types/enums/ProductGenre";
// import { getProductById } from "../../../services/productService";

export const ProductDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    // Lógica para traer el producto por ID
    // getProductById(Number(id)).then(setProduct);

    // DEMO:
    setProduct({
      id: 1,
      name: "Nike Air Red",
      description: "Zapatilla roja edición limitada",
      buyPrice: 10000,
      sellPrice: 14500,
      state: true,
      genre: ProductGenre.Unisex,
      categories: [{ id: 1, name: "Zapatillas", image: "https://nikearprod.vtexassets.com/arquivos/ids/1391289-1600-1600?width=1600&height=1600&aspect=true" }],
    });
  }, [id]);

  if (!product) return <div className={styles.loading}>Cargando producto...</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftColumn}>
        {/* Galería de imágenes */}
        <img
          src="https://via.placeholder.com/350x250?text=NIKE"
          alt={product.name}
          className={styles.mainImage}
        />
        {/* Thumbnails... */}
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.productName}>{product.name}</div>
        <div className={styles.productPrice}>${product.sellPrice.toLocaleString()}</div>
        <div className={styles.productDesc}>{product.description}</div>

        {/* Selectores de talle y color */}
        <div className={styles.selectors}>
          <label>
            Talle:
            <select>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
            </select>
          </label>
          <label>
            Color:
            <select>
              <option value="red">Rojo</option>
              <option value="blue">Azul</option>
            </select>
          </label>
        </div>

        <button className={styles.addToCartBtn}>Agregar al carrito</button>
      </div>
    </div>
  );
};
