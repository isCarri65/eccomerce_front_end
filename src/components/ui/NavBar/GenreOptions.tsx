import { FC, useEffect } from "react";
import { ProductGenre } from "../../../types/enums/ProductGenre";
import styles from "./GenreOptions.module.css";
import { useTypes } from "../../../hooks/useTypes";
import { useCategories } from "../../../hooks/useCategories";
import { IType } from "../../../types/Type/IType";
import { ICategory } from "../../../types/Category/ICategory";
import { filterStore, IFilterValues } from "../../../stores/filterStore";
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router-dom";

interface IGenreOptionsProps {
  genre: ProductGenre;
}
export const GenreOptions: FC<IGenreOptionsProps> = ({ genre }) => {
  console.log(genre);
  const { types, fetchTypes } = useTypes();
  const { categories } = useCategories();
  const nav = useNavigate();
  const { addCategory, setFilters } = filterStore(
    useShallow((state) => ({
      addCategory: state.addCategory,
      setFilters: state.setFilters,
    }))
  );

  const filterCategoriesByType = (type: IType): ICategory[] => {
    return categories.filter((category) => category.type.id === type.id);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const handleSelectCategory = (category: ICategory, type: IType) => {
    const filterValues: Partial<IFilterValues> = {
      genero: genre,
      tipoProducto: type,
      categorias: [category],
    };
    setFilters(filterValues);
    nav(`/ProductCatalog/${genre}/${type.name}/category=${category.name}`);
  };
  return (
    <div className={styles.genreOptionContainer}>
      {types.map((type) => (
        <div className={styles.typeContainer} key={type.id}>
          <p className={styles.typeName}>{type.name}</p>
          {filterCategoriesByType(type).map((category) => (
            <p
              key={category.id}
              onClick={() => handleSelectCategory(category, type)}
            >
              {category.name}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};
