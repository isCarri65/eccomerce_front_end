import { useState } from "react";
import styles from "./SidebarFilters.module.css";
import { ProductGenre } from "../../../types/enums/ProductGenre";
import { ICategory } from "../../../types/Category/ICategory";

// Opciones demo, reemplazá cuando tengas datos reales
const genres = [
  { value: ProductGenre.MALE, label: "Hombre" },
  { value: ProductGenre.FEMALE, label: "Mujer" },
  { value: ProductGenre.CHILDREN, label: "Niño/a" },
];

const categories: ICategory[] = [
  { id: 1, name: "Zapatillas", image: "" },
  { id: 2, name: "Indumentaria", image: "" },
  { id: 3, name: "Accesorios", image: "" },
];

export const SidebarFilters = ({
  selectedGenre,
  setSelectedGenre,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
}: {
  selectedGenre: ProductGenre | null;
  setSelectedGenre: (genre: ProductGenre | null) => void;
  selectedCategory: number | null;
  setSelectedCategory: (catId: number | null) => void;
  onClearFilters: () => void;
}) => {
  // Acordeones abiertos
  const [open, setOpen] = useState<Record<string, boolean>>({
    genero: true,
    precio: false,
    talle: false,
    categorias: true,
    deporte: false,
    descuentos: false,
    tipo: false,
  });

  const toggle = (key: string) => setOpen({ ...open, [key]: !open[key] });

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.title}>Filtros</h2>
        <button className={styles.clearBtn} onClick={onClearFilters}>
          Limpiar Filtros
        </button>
      </div>

      <div className={styles.accordion}>
        {/* Género */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("genero")}>
            <span>Género</span>
            <span className={styles.accordionIcon}>{open.genero ? "−" : "+"}</span>
          </button>
          {open.genero && (
            <div className={styles.accordionPanel}>
              {genres.map((g, index) => (
                <label key={index} className={styles.filterLabel}>
                  <input
                    type="radio"
                    name="genero"
                    checked={selectedGenre === g.value}
                    onChange={() => setSelectedGenre(g.value)}
                  />
                  {g.label}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Precio */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("precio")}>
            <span>Precio</span>
            <span className={styles.accordionIcon}>{open.precio ? "−" : "+"}</span>
          </button>
          {open.precio && (
            <div className={styles.accordionPanel}>
              {/* Filtros de precio (ejemplo, cambiá por tu lógica) */}
              <label className={styles.filterLabel}>
                <input type="checkbox" /> $0 - $50.000
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> $50.001 - $100.000
              </label>
            </div>
          )}
        </div>
        {/* Talle */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("talle")}>
            <span>Talle</span>
            <span className={styles.accordionIcon}>{open.talle ? "−" : "+"}</span>
          </button>
          {open.talle && (
            <div className={styles.accordionPanel}>
              {/* Ejemplo: */}
              <label className={styles.filterLabel}>
                <input type="checkbox" /> 38
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> 40
              </label>
            </div>
          )}
        </div>
        {/* Categorías */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("categorias")}>
            <span>Categorías</span>
            <span className={styles.accordionIcon}>{open.categorias ? "−" : "+"}</span>
          </button>
          {open.categorias && (
            <div className={styles.accordionPanel}>
              {categories.map((cat) => (
                <label key={cat.id} className={styles.filterLabel}>
                  <input
                    type="radio"
                    name="categoria"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Deporte */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("deporte")}>
            <span>Deporte</span>
            <span className={styles.accordionIcon}>{open.deporte ? "−" : "+"}</span>
          </button>
          {open.deporte && (
            <div className={styles.accordionPanel}>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> Fútbol
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> Running
              </label>
            </div>
          )}
        </div>
        {/* Descuentos */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("descuentos")}>
            <span>Descuentos</span>
            <span className={styles.accordionIcon}>{open.descuentos ? "−" : "+"}</span>
          </button>
          {open.descuentos && (
            <div className={styles.accordionPanel}>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> Sólo productos en oferta
              </label>
            </div>
          )}
        </div>
        {/* Tipo */}
        <div className={styles.accordionItem}>
          <button className={styles.accordionBtn} onClick={() => toggle("tipo")}>
            <span>Tipo</span>
            <span className={styles.accordionIcon}>{open.tipo ? "−" : "+"}</span>
          </button>
          {open.tipo && (
            <div className={styles.accordionPanel}>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> Nuevos
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> Outlet
              </label>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
