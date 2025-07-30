import { FC } from "react";
import { IType } from "../../../types/Type/IType";
import styles from "./TypeOptions.module.css";
import { useCategories } from "../../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import { ICategory } from "../../../types/Category/ICategory";

interface ITypeOptionsProps {
  type: IType;
}

export const TypeOptions: FC<ITypeOptionsProps> = ({ type }) => {
  const { categories } = useCategories();
  const nav = useNavigate();

  const filterCategoriesByType = (): ICategory[] => {
    return categories
      .filter((category) => category.type.name === type.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const filterCategoriesByTag = (tag: string): ICategory[] => {
    return categories
      .filter((category) => category.tags.includes(tag))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleSelectCategory = (
    sportCategory: ICategory,
    subcategory: ICategory
  ) => {
    const parsedName1 = sportCategory.name.replace(/\s+/g, "-");
    const parsedName2 = subcategory.name.replace(/\s+/g, "-");

    nav(`/productsCatalog/${type.name}/${parsedName1}/${parsedName2}`);
  };

  const handleSelectSport = (sportCategory: ICategory) => {
    const parsedName = sportCategory.name.replace(/\s+/g, "-");
    nav(`/productsCatalog/${type.name}/${parsedName}`);
  };
  return (
    <div className={styles.genreOptionContainer}>
      <div className={styles.contentContainer}>
        {categories &&
          filterCategoriesByType().map((category) => (
            <div className={styles.typeContainer} key={category.id}>
              <p
                className={styles.categorySportName}
                onClick={() => handleSelectSport(category)}
              >
                {category.name}
              </p>
              {filterCategoriesByTag(category.name).map((subcategory) => (
                <p
                  className={styles.subcategoryName}
                  key={subcategory.id}
                  onClick={() => handleSelectCategory(category, subcategory)}
                >
                  {subcategory.name}
                </p>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
