import styles from "./InfoSection.module.css";
import imagePay from "../../../../assets/homeImages/hand_paying_image.webp";
import SupportIcon from "../../../../assets/homeImages/headset-solid.svg?react";
export const InfoSection = () => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          Beneficios para tu experiencia de compra
        </h2>
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoCard}>
          <div className={styles.imageContainer}>
            <img src={imagePay} alt="Imgen de medios de pago" />
          </div>
          <p>Todos los medios de pago</p>
          <p className={styles.supportText}>
            Ofrecemos flexibles metodos de pago para tu comodidad.
          </p>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.imageContainer}>
            <SupportIcon className={styles.imageSupport} />
          </div>
          <p>Soporte al Cliente</p>
          <p className={styles.supportText}>
            Ofrecemos asistencia rápida y efectiva para tus consultas todos los
            dias
          </p>
        </div>
      </div>
    </div>
  );
};
