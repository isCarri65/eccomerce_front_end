import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Icon/nike_logo_2.png";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../../../types/User/User";

export const NavBar = () => {
  const [isLoggin, setIsLoggin] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [offsetY, setOffsetY] = useState(0);
  const lastScrollY = useRef(0);
  const navbarHeight = 80; // altura del navbar

  const handleScroll = () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY.current;

    let newOffset = offsetY + delta;

    // Limitar el desplazamiento entre 0 y navbarHeight
    newOffset = Math.max(0, Math.min(navbarHeight, newOffset));

    setOffsetY(newOffset);
    lastScrollY.current = currentY;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <nav className={styles.navBarContainer}>
      <div
        className={styles.navBar}
        style={{ transform: `translateY(-${offsetY}px)` }}
      >
        <div className={styles.logoContainer}>
          <img src={logo} alt="logo de nike" />
        </div>
        <div className={styles.categoriasContainer}>
          <p>Nuevo</p>
          <p>Hombre</p>
          <p>Mujer</p>
          <p>Niño/a</p>
          <p>Deporte</p>
          {isLoggin ? <p>Administrador</p> : ""}
        </div>
        <div className={styles.iconContainer}>
          <FontAwesomeIcon
            className={styles.iconItem}
            icon={faMagnifyingGlass}
            color="red"
          />
          <FontAwesomeIcon className={styles.iconItem} icon={faCartShopping} />
          <FontAwesomeIcon className={styles.iconItem} icon={faUser} />
          {isLoggin && user ? <p>{user.username}</p> : ""}
        </div>
      </div>
    </nav>
  );
};
