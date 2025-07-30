import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Icon/nike_logo_2.png";
import { useEffect, useRef, useState } from "react";
import { CategoryOptionSelect } from "../../../types/CategoryOptionSelect";
import { GenreOptions } from "./GenreOptions";
import { TypeOptions } from "./TypeOptions";
import { ProductGenre } from "../../../types/enums/ProductGenre";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import SearchBarTask, { SearchBarProducts } from "./SearchBarProducts";
import { useCategories } from "../../../hooks/useCategories";
import { useTypes } from "../../../hooks/useTypes";
import { CartSidebar } from "../CartSideBar/CartSideBar";

const genreValues = [
  { value: ProductGenre.MALE, label: "Hombre" },
  { value: ProductGenre.FEMALE, label: "Mujer" },
  { value: ProductGenre.CHILDREN, label: "Niños" },
];

export const NavBar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);
  const lastScrollY = useRef(0);
  const navbarHeight = 80;

  const { fetchCategories } = useCategories();
  const { fetchTypes } = useTypes();
  const [showCart, setShowCart] = useState(false);
  const [selectedCategoria, setSelectedCategoria] =
    useState<CategoryOptionSelect | null>(null);

  const handleCart = () => {
    console.log(showCart);
    setShowCart(!showCart);
  };

  // Manejo del scroll para ocultar/mostrar el navbar
  const handleScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY.current;
    let newOffset = offsetY + delta;
    newOffset = Math.max(0, Math.min(navbarHeight, newOffset));
    setOffsetY(newOffset);
    lastScrollY.current = currentY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offsetY]);

  useEffect(() => {
    fetchCategories();
    fetchTypes();
  }, []);

  const categoryOptionsSelects: CategoryOptionSelect[] = [
    ...genreValues.map(
      (g) =>
        ({
          kind: "genero",
          value: g.label,
          param: g.value,
        } as CategoryOptionSelect)
    ),
    {
      kind: "tipo",
      value: "Deporte",
      param: { id: 2, name: "Deporte" },
    } as CategoryOptionSelect,
  ];

  const changePage = (paramPath: string) => {
    const path = `productsCatalog/${paramPath}`;
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navBarContainer}>
        <div
          className={styles.navBar}
          style={{
            transform: selectedCategoria ? "" : `translateY(-${offsetY}px)`,
          }}
        >
          <div className={styles.logoContainer}>
            <img src={logo} alt="logo de nike" onClick={() => navigate("/")} />
          </div>

          <ul className={styles.categoriasContainer}>
            <li>
              <button
                className={styles.navLink}
                onClick={() => changePage("Nuevo")}
              >
                Nuevo
              </button>
            </li>
            {categoryOptionsSelects.map((cat) => (
              <li
                key={`${cat.kind}-${cat.value}`}
                onMouseEnter={() => setSelectedCategoria(cat)}
                onMouseLeave={() => setSelectedCategoria(null)}
              >
                <button
                  className={styles.navLink}
                  onClick={() => changePage(cat.value)}
                >
                  {cat.value}
                </button>
              </li>
            ))}
          </ul>
          <div className={styles.searchComponentContainer}>
            <SearchBarProducts />
          </div>

          <div className={styles.iconContainer}>
            <FontAwesomeIcon
              className={styles.iconItem}
              icon={faCartShopping}
              onClick={handleCart}
            />
            <FontAwesomeIcon
              className={styles.iconItem}
              icon={faUser}
              onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
            />

            {isAuthenticated && user && (
              <p className={styles.userName}>{user.name}</p>
            )}
          </div>
        </div>
      </nav>

      <div
        className={styles.OptionsCategoryContainer}
        onMouseEnter={() => setSelectedCategoria(selectedCategoria)}
        onMouseLeave={() => setSelectedCategoria(null)}
      >
        {selectedCategoria &&
          (selectedCategoria.kind === "genero" ? (
            <GenreOptions genre={selectedCategoria.param} />
          ) : (
            <TypeOptions type={selectedCategoria.param} />
          ))}
      </div>
      {showCart && (
        <CartSidebar showCart={showCart} setShowCart={setShowCart} />
      )}
    </div>
  );
};
