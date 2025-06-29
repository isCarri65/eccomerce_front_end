import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../../stores/userStore";
import { ProfilePersonal } from "./ProfilePersonal";
import { ProfileFavorites } from "./ProfileFavorites";
import { ProfileHistory } from "./ProfileHistory";
import { AdminProducts } from "./AdminProducts";
import { AdminDiscounts } from "./AdminDiscounts";
import { AdminCreateUser } from "./AdminCreateUser";
import { AdminType } from "./AdminType";
import { AdminCategory } from "./AdminCategory";
import { AdminColor } from "./AdminColor";
import styles from "./ProfileScreen.module.css";

type ProfileTab =
  | "personal"
  | "favorites"
  | "history"
  | "products"
  | "discounts"
  | "admins";

export const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [adminSubTab, setAdminSubTab] = useState<String | null>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUserProfile } = useUserStore();
  const isAdmin = currentUserProfile?.role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderContent = () => {
    if (activeTab === "admins" && isAdmin) {
      switch (adminSubTab) {
        case "createUser":
          return <AdminCreateUser />;
        case "type":
          return <AdminType />;
        case "category":
          return <AdminCategory />;
        case "color":
          return <AdminColor />;
        default:
          return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              Seleccione una opción de administración
            </div>
          );
      }
    }
    return (
      <div className={styles.tabContentCard}>
        {(() => {
          switch (activeTab) {
            case "personal":
              return <ProfilePersonal />;
            case "favorites":
              return <ProfileFavorites />;
            case "history":
              return <ProfileHistory />;
            case "products":
              return <AdminProducts />;
            case "discounts":
              return <AdminDiscounts />;
            default:
              return null;
          }
        })()}
      </div>
    );
  };

  return (
    <div className={styles.profileScreenWrapper}>
      <div className={styles.profileScreenContent}>
        <div className={styles.tabNavBar}>
          <button
            className={
              activeTab === "personal"
                ? `${styles.tabButton} ${styles.tabButtonActive}`
                : styles.tabButton
            }
            onClick={() => {
              setActiveTab("personal");
              setDropdownOpen(false);
            }}
          >
            Datos Personales
          </button>
          <button
            className={
              activeTab === "favorites"
                ? `${styles.tabButton} ${styles.tabButtonActive}`
                : styles.tabButton
            }
            onClick={() => {
              setActiveTab("favorites");
              setDropdownOpen(false);
            }}
          >
            Favoritos
          </button>
          <button
            className={
              activeTab === "history"
                ? `${styles.tabButton} ${styles.tabButtonActive}`
                : styles.tabButton
            }
            onClick={() => {
              setActiveTab("history");
              setDropdownOpen(false);
            }}
          >
            Historial
          </button>
          {isAdmin && (
            <>
              <button
                className={
                  activeTab === "products"
                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                    : styles.tabButton
                }
                onClick={() => {
                  setActiveTab("products");
                  setDropdownOpen(false);
                }}
              >
                Productos
              </button>
              <button
                className={
                  activeTab === "discounts"
                    ? `${styles.tabButton} ${styles.tabButtonActive}`
                    : styles.tabButton
                }
                onClick={() => {
                  setActiveTab("discounts");
                  setDropdownOpen(false);
                }}
              >
                Descuentos
              </button>
              <div className={styles.adminDropdownWrapper} ref={dropdownRef}>
                <button
                  className={
                    activeTab === "admins"
                      ? `${styles.tabButton} ${styles.tabButtonActive}`
                      : styles.tabButton
                  }
                  onClick={() => {
                    setActiveTab("admins");
                    setAdminSubTab(null);
                    setDropdownOpen((prev) => !prev);
                  }}
                  type="button"
                >
                  Admins ▼
                </button>
                {isDropdownOpen && activeTab === "admins" && (
                  <div className={styles.adminDropdownMenu}>
                    <button onClick={() => setAdminSubTab("createUser")}>
                      Crear Usuario
                    </button>
                    <button onClick={() => setAdminSubTab("type")}>Tipo</button>
                    <button onClick={() => setAdminSubTab("category")}>
                      Categoría
                    </button>
                    <button onClick={() => setAdminSubTab("color")}>
                      Color
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};
