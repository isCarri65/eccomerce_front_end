import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Icon/nike_logo_2.png";
import { useEffect, useRef, useState } from "react";
import { IType } from "../../../types/Type/IType";
import { CategoryOptionSelect } from "../../../types/CategoryOptionSelect";
import { GenreOptions } from "./GenreOptions";
import { TypeOptions } from "./TypeOptions";
import { ProductGenre } from "../../../types/enums/ProductGenre";
import { useNavigate } from "react-router-dom";
import { CartSidebar } from "../CartSideBar/CartSideBar";
import { useAuth } from "../../../hooks/useAuth";

const genreValues = [
  ProductGenre.MALE,
  ProductGenre.FEMALE,
  ProductGenre.CHILDREN,
];
const typesOptions: IType[] = [
  {
    id: 1,
    name: "Nuevos",
  },
  {
    id: 2,
    name: "Deportes",
  },
];

export const NavBar = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);
  const lastScrollY = useRef(0);
  const navbarHeight = 80;

  const [showCart, setShowCart] = useState(false);
  const [selectedCategoria, setSelectedCategoria] =
    useState<CategoryOptionSelect | null>(null);

  //   //TEMPORAL SACAR
  //   const addToCart = (product: CartItem) => {
  //   const stored = sessionStorage.getItem('cartItems');
  //   let cart = stored ? JSON.parse(stored) : [];

  //   // Verificar si ya está en el carrito
  //   const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);

  //   if (existingItemIndex !== -1) {
  //     // Si ya está, sumamos cantidad
  //     cart[existingItemIndex].quantity += product.quantity;
  //   } else {
  //     // Si no está, lo agregamos
  //     cart.push({
  //       id: product.id,
  //       quantity: product.quantity,
  //       size: product.size,
  //       color: product.color,
  //     });
  //   }
  //   sessionStorage.setItem('cartItems', JSON.stringify(cart));
  // };

  // Manejo del scroll para ocultar/mostrar el navbar
  const handleCart = () => {
    setShowCart(!showCart);
  };
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

  // Cargar tus tipos (ejemplo: fetch a tu API)
  useEffect(() => {
    // fetch("/api/types").then(...).then(data => setTypes(data));
  }, []);

  const categoryOptionsSelects: CategoryOptionSelect[] = [
    ...genreValues.map(
      (g) => ({ kind: "genero", value: g, param: g } as CategoryOptionSelect)
    ),
    ...typesOptions.map(
      (t) => ({ kind: "tipo", value: t.name, param: t } as CategoryOptionSelect)
    ),
  ];

  const changePage = (paramPath: string) => {
    const path = `productsCatalog/${paramPath}`;
    navigate(path);
  };

  const moveToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className={styles.container}>
      <nav className={styles.navBarContainer}>
        <div
          className={styles.navBar}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {/* <button onClick={() => addToCart({
  id: '1',
  name: 'Product A',
  price: 25.99,
  size: 'M',
  quantity: 1,
  color: 'Red'
})}>Agregar Producto A</button> */}

          <div className={styles.logoContainer}>
            <img src={logo} alt="logo de nike" onClick={() => navigate("/")} />
          </div>

          <ul className={styles.categoriasContainer}>
            {categoryOptionsSelects.map((cat) => (
              <li key={`${cat.kind}-${cat.value}`}>
                <button
                  className={styles.navLink}
                  onMouseEnter={() => setSelectedCategoria(cat)}
                  onMouseLeave={() => setSelectedCategoria(null)}
                  onClick={() => changePage(cat.value)}
                >
                  {cat.value}
                </button>
              </li>
            ))}
          </ul>

          <div className={styles.iconContainer}>
            <FontAwesomeIcon
              className={styles.iconItem}
              icon={faMagnifyingGlass}
            />
            <FontAwesomeIcon
              className={styles.iconItem}
              icon={faCartShopping}
              onClick={() => handleCart()}
            />
            <FontAwesomeIcon
              icon={faUser}
              className={styles.iconItem}
              onClick={moveToProfile}
            />
            {isAuthenticated && user && (
              <p className={styles.userName}>{user.name}</p>
            )}
          </div>
        </div>

        <CartSidebar showCart={showCart} setShowCart={setShowCart} />
      </nav>
      <div className={styles.OptionsCategoryContainer}>
        {selectedCategoria &&
          (selectedCategoria.kind === "genero" ? (
            <GenreOptions genre={selectedCategoria.value} />
          ) : (
            <TypeOptions type={selectedCategoria.param} />
          ))}
      </div>
    </div>
  );
};
