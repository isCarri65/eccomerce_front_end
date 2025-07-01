import { useEffect, useState } from "react";
import styles from "./ProductCatalogScreen.module.css";
import { useNavigate } from "react-router-dom";
import { IProduct } from "../../../../types/Product/IProduct";
import { ProductGenre } from "../../../../types/enums/ProductGenre";
import { SidebarFilters } from "../../../ui/SidebarFilters/SidebarFilters";
import { getAllProducts } from "../../../../api/services/ProductService";

export const ProductCatalogScreen = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<ProductGenre | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<"recommended" | "price_asc" | "price_desc">("recommended");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllProducts()
      .then(setProducts)
      .catch(() => setError("No se pudieron cargar los productos"))
      .finally(() => setLoading(false));
  }, []);

  const handleClearFilters = () => {
    setSelectedGenre(null);
    setSelectedCategory(null);
  };

  // Guardar en el sessionStorage el id del producto
  const handleAddToCart = (productId: number) => {
    // Por ahora solo ids, luego sumale size/color/qty
    let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
    cart.push({ productId, quantity: 1 }); // Para futuras mejoras agregá userId, sizeId, etc.
    sessionStorage.setItem("cart", JSON.stringify(cart));
    alert("¡Producto agregado al carrito!");
  };

  let filtered = products;
  if (selectedGenre) filtered = filtered.filter(p => p.genre === selectedGenre);
  if (selectedCategory) filtered = filtered.filter(p => p.categories.some(c => c.id === selectedCategory));
  if (sortOption === "price_asc")
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortOption === "price_desc")
    filtered = [...filtered].sort((a, b) => b.price - a.price);

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
          {loading ? (
            <div className={styles.emptyMsgWrapper}><div className={styles.emptyMsg}>Cargando productos...</div></div>
          ) : error ? (
            <div className={styles.emptyMsgWrapper}><div className={styles.emptyMsg}>{error}</div></div>
          ) : filtered.length === 0 ? (
            <div className={styles.emptyMsgWrapper}>
              <div className={styles.emptyMsg}>
                No hay productos agregados en este catálogo.
              </div>
            </div>
          ) : (
            filtered.map(prod => (
              <div
                className={styles.productCard}
                key={prod.id}
                onClick={() => navigate(`/product/${prod.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles.productImage}>
                  {/* <img src={prod.image ?? "/assets/placeholder.jpg"} alt={prod.name} /> */}
                </div>
                <div className={styles.productDetails}>
                  <div className={styles.productName}>{prod.name}</div>
                  <div className={styles.productDesc}>{prod.description}</div>
                  <div className={styles.productPrice}>
                    {typeof prod.price === 'number'
                      ? `$${prod.price.toLocaleString()}`
                      : 'Precio no disponible'}
                  </div>
                  <button
                    className={styles.addToCartBtn}
                    type="button"
                    onClick={e => {
                      e.stopPropagation(); // Así no navega al detalle si solo agregás al carrito
                      handleAddToCart(prod.id);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};
