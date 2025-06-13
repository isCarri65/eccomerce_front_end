import styles from "./AdminLayout.module.css";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const AdminLayout = ({ children }: Props) => (
  <div className={styles.pageContainer}>
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/assets/Icon/nike_logo_2.png" alt="Nike Logo" />
      </div>
      <nav className={styles.nav}>
        <a href="/admin/productos" className={styles.navBtn}>Productos</a>
        <a href="/admin/categorias" className={styles.navBtn}>Categorías</a>
        <a href="/admin/descuentos" className={styles.navBtn}>Descuentos</a>
      </nav>
    </header>
    <main className={styles.main}>{children}</main>
    <footer className={styles.footer}>
      <div className={styles.footerLogo}>
        <img src="/assets/Icon/nike_logo_2.png" alt="Nike Logo" />
      </div>
      <div className={styles.footerLinks}>
        <span>© 2024 Nike. Todos los derechos reservados.</span>
      </div>
    </footer>
  </div>
);
