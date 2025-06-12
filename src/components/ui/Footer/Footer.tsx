import styles from "./Footer.module.css";
import logo from "../../../assets/Icon/nike_logo_2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles["firstSection"]}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Logo" />
        </div>
        <div className={styles.contactsContainer}>
          <div className={styles.contactLocation}>
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{ color: "#ffffff", fontSize: "1.2rem" }}
            />
            <p>345 Faulconer Drive, Suite 4 • Charlottesville, CA, 12345</p>
          </div>
          <div className={styles.contactNumberContainer}>
            <div className={styles.contactNumberItem}>
              <FontAwesomeIcon
                icon={faPhone}
                style={{ color: "#ffffff", fontSize: "1.2rem" }}
              />
              <p>(261) 456-7890</p>
            </div>
            <div className={styles.contactNumberItem}>
              <i
                className="fa-brands fa-whatsapp"
                style={{ color: "#ffffff" }}
              ></i>
              <p>(261) 895-5632</p>
            </div>
          </div>
          <div className={styles.socialNetworksContainer}>
            <p>Redes Sociales:</p>
            <i
              className="fa-brands fa-facebook"
              style={{ color: "white", fontSize: "1.5rem" }}
            ></i>
            <i
              className="fa-brands fa-x-twitter"
              style={{ color: "#ffffff", fontSize: "1.5rem" }}
            ></i>
            <i
              className="fa-brands fa-youtube"
              style={{ color: "#ffffff", fontSize: "1.5rem" }}
            ></i>
            <i
              className="fa-brands fa-instagram"
              style={{ color: "#ffffff", fontSize: "1.5rem" }}
            ></i>
          </div>
        </div>
      </div>
      <div className={styles["secondSection"]}>
        <div className={styles.linksContainer}>
          <p>Sobre Nosotros</p>
          <p>Defensa al Consumidor</p>
          <p>Política de Privacidad</p>
          <p>Términos y Condiciones</p>
          <p>Atencion al Cliente</p>
        </div>
        <div className={styles.copyrightContainer}>
          <p>
            Copyright© 2025 <i>ALfonso Corporation</i>
          </p>
        </div>
      </div>
    </footer>
  );
};
