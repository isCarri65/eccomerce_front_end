import styles from "./ProductCarruselSection.module.css";
import SimpleBar from "simplebar-react";
import "./ScrollStyle.css";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { IProduct } from "../../../../types/Product/IProduct";
import { ProductCard } from "../../ProductCard/ProductCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getAllProducts } from "../../../../api/services/ProductService";

export const ProductCarruselSection = () => {
  const [populatesProducts, setPopulatesProducts] =
    useState<IProduct[] | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

useEffect(() => {

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setPopulatesProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);


  // Función para mover el carrusel con las flechas
  const scroll = (
    direction: "left" | "right",
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const scrollAmount = 350; // Cantidad de desplazamiento
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Productos Populares</h2>
      </div>
      <div className={styles.carouselContainer}>
        {/* Flechas de navegación */}
        <button
          className={`${styles.arrow} ${styles.left}`}
          onClick={(e) => scroll("left", e)}
        >
          <FontAwesomeIcon icon={faArrowLeft} className={styles.arrowIcon} />
        </button>
        <button
          className={`${styles.arrow} ${styles.right}`}
          onClick={(e) => scroll("right", e)}
        >
          <FontAwesomeIcon icon={faArrowRight} className={styles.arrowIcon} />
        </button>

        {/* Carrusel con scrollbar */}
        <SimpleBar
          className={styles.scrollbarContainer}
          scrollableNodeProps={{ ref: scrollRef }}
        >
          <div className={styles.productsTrack}>
            {populatesProducts ? populatesProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            )) : ("Cargando Productos")}
          </div>
        </SimpleBar>
        <div className={styles.linea}></div>
      </div>
    </div>
  );
};
