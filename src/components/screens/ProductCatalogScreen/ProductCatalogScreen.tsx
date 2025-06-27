import { useEffect, useState } from "react";
import styles from "./ProductCatalogScreen.module.css";
import { IProduct } from "../../../types/Product/IProduct";
import { ProductGenre } from "../../../types/enums/ProductGenre";
import { SidebarFilters } from "../../ui/SidebarFilters/SidebarFilters";

// Demo products, reemplaza por fetch real cuando esté tu API
const demoProducts: IProduct[] = [
  
];

export const ProductCatalogScreen = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<ProductGenre | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<"recommended" | "price_asc" | "price_desc">("recommended");

  useEffect(() => {
    setProducts(demoProducts); // Cambia por fetch real cuando esté tu API
  }, []);

  // Limpiar filtros
  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSelectedCategory(null);
  };

  // Filtrado y ordenado
  let filtered = products;
  if (selectedGenre) filtered = filtered.filter(p => p.genre === selectedGenre);
  if (selectedCategory) filtered = filtered.filter(p => p.categories.some(c => c.id === selectedCategory));
  if (sortOption === "price_asc")
    filtered = [...filtered].sort((a, b) => a.sellPrice - b.sellPrice);
  if (sortOption === "price_desc")
    filtered = [...filtered].sort((a, b) => b.sellPrice - a.sellPrice);

  return (
    <div className={styles.catalogContainer}>
      <SidebarFilters
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onClearFilters={handleClearFilters}
      />

      <main className={styles.productsSection}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>Productos</h1>
            <span className={styles.breadcrumbs}>Inicio &gt; Catálogo</span>
          </div>
          <div className={styles.sortControl}>
            <label>Ordenar por: </label>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value as any)}
              className={styles.sortSelect}
            >
              <option value="recommended">Recomendado</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </div>
        <section className={styles.productsGrid}>
            {filtered.length === 0 ? (
    <div className={styles.emptyMsgWrapper}>
      <div className={styles.emptyMsg}>
        No hay productos agregados en este catálogo.
      </div>
    </div>
  ) : (
    filtered.map(prod => (
      <div className={styles.productCard} key={prod.id}>
        <div className={styles.productImage}>
          <img src="https://via.placeholder.com/160x110?text=NIKE" alt={prod.name} />
        </div>
        <div className={styles.productDetails}>
          <div className={styles.productName}>{prod.name}</div>
          <div className={styles.productDesc}>{prod.description}</div>
          <div className={styles.productPrice}>${prod.sellPrice.toLocaleString()}</div>
        </div>
      </div>
    ))
  )}
</section>
      </main>
    </div>
  );
};
