import {
  faCartShopping,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./NavBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../assets/Icon/nike_logo_2.png";
import { useState } from "react";

export const NavBar = () => {
  const [isLoggin, setIsLoggin] = useState(false);
  const [user, setUser] = useState(null);
  return (
    <div className={styles.navBarContainer}>
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
      </div>
      {isLoggin && user ? <p>{user.name}</p> : ""}
    </div>
  );
};
