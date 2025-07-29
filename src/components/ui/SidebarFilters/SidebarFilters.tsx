import { use, useEffect, useState } from "react";
import styles from "./SidebarFilters.module.css";
import { ProductGenre } from "../../../types/enums/ProductGenre";
import { ICategory } from "../../../types/Category/ICategory";
import { filterStore } from "../../../stores/filterStore";
import { useShallow } from "zustand/react/shallow";
import { useTypes } from "../../../hooks/useTypes";
import { useCategories } from "../../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import { IType } from "../../../types/Type/IType";
import { useProductDiscounts } from "../../../hooks/useProductDiscounts";
import { useProducts } from "../../../hooks/useProducts";

// Opciones demo, reemplazá cuando tengas datos reales
const genres = [
  { value: ProductGenre.MALE, label: "Hombre" },
  { value: ProductGenre.FEMALE, label: "Mujer" },
  { value: ProductGenre.CHILDREN, label: "Niño/a" },
  { value: ProductGenre.UNISEX, label: "Unisex" },
];

export const SidebarFilters = ({}: {}) => {
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

  const {
    setFilters,
    minPriceState,
    maxPriceState,
    addCategory,
    removeCategory,
    selectedGenre,
    selectedCategories,
    selectedType,
    resetFilters,
    pageable,
    filters,
  } = filterStore(
    useShallow((state) => ({
      filters: state.filters,
      minPriceState: state.filters.minPrice,
      maxPriceState: state.filters.maxPrice,
      selectedGenre: state.filters.genre,
      selectedCategories: state.filters.categories,
      selectedType: state.filters.type,
      pageable: state.pageable,
      setFilters: state.setFilters,
      addCategory: state.addCategory,
      removeCategory: state.removeCategory,
      resetFilters: state.resetFilters,
    }))
  );

  const { types } = useTypes();
  const { categories } = useCategories();
  const { filterProducts } = useProducts();
  const [minPrice, setMinPrice] = useState<number | null>(minPriceState);
  const [maxPrice, setMaxPrice] = useState<number | null>(maxPriceState);
  const toggle = (key: string) => setOpen({ ...open, [key]: !open[key] });

  const nav = useNavigate();

  const filterCategoriesByTypeIgnore = (name: string): ICategory[] => {
    return categories
      .filter(
        (category) =>
          category.type.name !== name && !category.tags.includes(name)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };
  const filterCategoriesByTypeName = (name: string): ICategory[] => {
    return categories
      .filter((category) => category.type.name === name)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const filterCategoriesByTag = (tag: string): ICategory[] => {
    return categories
      .filter((category) => category.tags.includes(tag))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    console.log("Min price changed:", value);
    setFilters({ minPrice: value });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFilters({ maxPrice: value });
    console.log("Filters changed:", filters);
  };

  useEffect(() => {
    filterProducts(filters, pageable);
  }, [
    minPriceState,
    maxPriceState,
    selectedGenre,
    selectedCategories,
    selectedType,
  ]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.title}>Filtros</h2>
        <button className={styles.clearBtn} onClick={resetFilters}>
          Limpiar Filtros
        </button>
      </div>

      <div className={styles.accordion}>
        {/* Género */}
        <div className={styles.accordionItem}>
          <button
            className={styles.accordionBtn}
            onClick={() => toggle("genero")}
          >
            <span>Género</span>
            <span className={styles.accordionIcon}>
              {open.genero ? "−" : "+"}
            </span>
          </button>
          {open.genero && (
            <div className={styles.accordionPanel}>
              {genres.map((g, index) => (
                <label key={index} className={styles.filterLabel}>
                  <input
                    type="radio"
                    name="genero"
                    checked={filters.genre === g.value}
                    onChange={() => setFilters({ genre: g.value })}
                  />
                  {g.label}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Precio */}
        <div className={styles.accordionItem}>
          <button
            className={styles.accordionBtn}
            onClick={() => toggle("precio")}
          >
            <span>Precio</span>
            <span className={styles.accordionIcon}>
              {open.precio ? "−" : "+"}
            </span>
          </button>
          {open.precio && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label>
                Precio mínimo:
                <input
                  type="number"
                  value={minPrice ? minPrice : ""}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  onBlur={handleMinChange}
                  min={0}
                />
              </label>

              <label>
                Precio máximo:
                <input
                  type="number"
                  value={maxPrice ? maxPrice : ""}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  onBlur={handleMaxChange}
                  min={0}
                />
              </label>
            </div>
          )}
        </div>
        {/* Talle */}

        {/* Categorías */}
        <div className={styles.accordionItem}>
          <button
            className={styles.accordionBtn}
            onClick={() => toggle("categorias")}
          >
            <span>Categorías</span>
            <span className={styles.accordionIcon}>
              {open.categorias ? "−" : "+"}
            </span>
          </button>
          {open.categorias && (
            <div className={styles.accordionPanel}>
              {filterCategoriesByTypeIgnore("Deporte").map((cat) => (
                <label key={cat.id} className={styles.filterLabel}>
                  <input
                    type="checkbox"
                    name={cat.name}
                    checked={selectedCategories.includes(cat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addCategory(cat);
                      } else {
                        removeCategory(cat.id);
                      }
                    }}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Deporte */}
        <div className={styles.accordionItem}>
          <button
            className={styles.accordionBtn}
            onClick={() => toggle("deporte")}
          >
            <span>Deporte</span>
            <span className={styles.accordionIcon}>
              {open.deporte ? "−" : "+"}
            </span>
          </button>
          {open.deporte && (
            <div className={styles.accordionPanel}>
              {filterCategoriesByTypeName("Deporte").map((cat) => (
                <label key={cat.id} className={styles.filterLabel}>
                  <input
                    type="checkbox"
                    name={cat.name}
                    checked={selectedCategories.includes(cat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        addCategory(cat);
                      } else {
                        removeCategory(cat.id);
                      }
                    }}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Descuentos */}
        <div className={styles.accordionItem}>
          <button
            className={styles.accordionBtn}
            onClick={() => toggle("descuentos")}
          >
            <span>Descuentos</span>
            <span className={styles.accordionIcon}>
              {open.descuentos ? "−" : "+"}
            </span>
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
          <button
            className={styles.accordionBtn}
            onClick={() => toggle("tipo")}
          >
            <span>Tipo</span>
            <span className={styles.accordionIcon}>
              {open.tipo ? "−" : "+"}
            </span>
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
