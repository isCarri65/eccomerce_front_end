import { FC, use, useEffect, useState } from "react";
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
  const { categories, fetchCategories } = useCategories();
  const nav = useNavigate();
  const { addCategory, setFilters } = filterStore(
    useShallow((state) => ({
      addCategory: state.addCategory,
      setFilters: state.setFilters,
    }))
  );

  const filterCategoriesByType = (type: IType): ICategory[] => {
    return categories
      .filter(
        (category) =>
          category.type.id === type.id && !category.tags.includes("Deporte")
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  useEffect(() => {
    fetchTypes();
    fetchCategories();
  }, []);

  const handleSelectCategory = (category: ICategory, type: IType) => {
    const filterValues: Partial<IFilterValues> = {
      genero: genre,
      tipoProducto: type,
      categorias: [category],
    };
    setFilters(filterValues);
    nav(`/productsCatalog/${genre}/${type.name}/${category.name}`);
  };

  const handleSelctType = (type: IType) => {
    const filterValues: Partial<IFilterValues> = {
      genero: genre,
      tipoProducto: type,
      categorias: [],
    };
    setFilters(filterValues);
    nav(`/productsCatalog/${genre}/${type.name}`);
  };
  return (
    <div className={styles.genreOptionContainer}>
      <div className={styles.contentContainer}>
        {types &&
          types.map((type) => (
            <div className={styles.typeContainer} key={type.id}>
              <p
                className={styles.typeName}
                onClick={() => handleSelctType(type)}
              >
                {type.name}
              </p>
              {filterCategoriesByType(type).map((category) => (
                <p
                  className={styles.categoryName}
                  key={category.id}
                  onClick={() => handleSelectCategory(category, type)}
                >
                  {category.name}
                </p>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
