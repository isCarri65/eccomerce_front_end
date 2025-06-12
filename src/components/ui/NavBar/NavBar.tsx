import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Icon/nike_logo_2.png";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../../../types/User/IUser";
import { IType } from "../../../types/Type/IType";
import { CategoryOptionSelect } from "../../../types/CategoryOptionSelect";
import { GenreOptions } from "./GenreOptions";
import { TypeOptions } from "./TypeOptions";
import { ProductGenre } from "../../../types/enums/ProductGenre";

import { useNavigate } from "react-router-dom";
const genreValues = [
  ProductGenre.Male,
  ProductGenre.Female,
  ProductGenre.Children,
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
  const [isLoggin, setIsLoggin] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const [offsetY, setOffsetY] = useState(0);
  const lastScrollY = useRef(0);
  const navbarHeight = 80;

  const [selectedCategoria, setSelectedCategoria] =
    useState<CategoryOptionSelect | null>(null);

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

  return (
    <nav className={styles.navBarContainer}>
      <div
        className={styles.navBar}
        style={{ transform: `translateY(-${offsetY}px)` }}
      >
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo de nike" />
        </div>

        <ul className={styles.categoriasContainer}>
          {categoryOptionsSelects.map((cat) => (
            <li key={`${cat.kind}-${cat.value.toString()}`}>
              <button
                className={styles.navLink}
                onMouseEnter={() => setSelectedCategoria(cat)}
                onMouseLeave={() => setSelectedCategoria(null)}
                onClick={() => changePage(cat.value)}
              >
                {cat.value.toString()}
              </button>
            </li>
          ))}

          {isLoggin && (
            <li>
              <button>Administrador</button>
            </li>
          )}
        </ul>

        <div className={styles.iconContainer}>
          <FontAwesomeIcon
            className={styles.iconItem}
            icon={faMagnifyingGlass}
          />
          <FontAwesomeIcon className={styles.iconItem} icon={faCartShopping} />
          <FontAwesomeIcon className={styles.iconItem} icon={faUser} />
          {isLoggin && user && <p>{user.name}</p>}
        </div>
      </div>

      <div className={styles.OptionsCategoryContainer}>
        {selectedCategoria &&
          (selectedCategoria.kind === "genero" ? (
            <GenreOptions genre={selectedCategoria.value} />
          ) : (
            <TypeOptions type={selectedCategoria.param} />
          ))}
      </div>
    </nav>
  );
};
