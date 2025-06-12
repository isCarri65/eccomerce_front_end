import styles from "./ProductCarruselSection.module.css";
import SimpleBar from "simplebar-react";
import "./ScrollStyle.css";
import { MouseEvent, useRef, useState } from "react";
import { IProduct } from "../../../../types/Product/IProduct";
import { ProductCard } from "../../ProductCard/ProductCard";
import { ProductGenre } from "../../../../types/enums/ProductGenre";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
const productExample: IProduct[] = [
  {
    id: "1",
    name: "Producto 1",
    description: "Descripción del producto 1",
    buyPrice: 100,
    sellPrice: 150,
    state: true,
    genre: ProductGenre.Male,
    categories: [],
  },
  {
    id: "2",
    name: "Producto 2",
    description: "Descripción del producto 2",
    buyPrice: 200,
    sellPrice: 250,
    state: true,
    genre: ProductGenre.Female,
    categories: [],
  },
  {
    id: "3",
    name: "Producto 3",
    description: "Descripción del producto 3",
    buyPrice: 300,
    sellPrice: 350,
    state: true,
    genre: ProductGenre.Unisex,
    categories: [],
  },
  {
    id: "4",
    name: "Producto 4",
    description: "Descripción del producto 4",
    buyPrice: 400,
    sellPrice: 450,
    state: true,
    genre: ProductGenre.Children,
    categories: [],
  },
  {
    id: "5",
    name: "Producto 5",
    description: "Descripción del producto 5",
    buyPrice: 500,
    sellPrice: 550,
    state: true,
    genre: ProductGenre.Children,
    categories: [],
  },
  // Agrega más productos de ejemplo según sea necesario
];

export const ProductCarruselSection = () => {
  const [populatesProducts, setPopulatesProducts] =
    useState<IProduct[]>(productExample);

  const scrollRef = useRef<HTMLDivElement>(null);

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
            {populatesProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </SimpleBar>
        <div className={styles.linea}></div>
      </div>
    </div>
  );
};
