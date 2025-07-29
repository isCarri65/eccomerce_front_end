import { useState } from "react";
import styles from "./SearchBar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useProducts } from "../../../hooks/useProducts";
import { filterStore } from "../../../stores/filterStore";

export function SearchBarProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const { actionSearch, fetchProducts } = useProducts(); // Agregar getTask
  const pageable = filterStore((state) => state.pageable);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchTerm(value);

    // Si el input está vacío, cargar todas las tareas de nuevo
    if (value.trim() === "") {
      fetchProducts();
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    console.log(searchTerm);
    e.preventDefault();
    if (searchTerm.trim() === "") return;
    console.log(searchTerm);
    actionSearch(searchTerm, pageable);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchbox}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Buscar..."
        className={styles.inputsearch}
      />
      <button
        className={styles.btnsearch}
        type="submit"
        disabled={!searchTerm.trim()}
      >
        <FontAwesomeIcon color="black" icon={faSearch} />
      </button>
    </form>
  );
}

export default SearchBarProducts;
