import { FC } from "react";
import { ICategory } from "../../../../types/Category/ICategory";
import styles from "./CategoryCard.module.css";
import { useNavigate } from "react-router-dom";
interface ICategoryCard {
  category: ICategory;
}
export const CategoryCard: FC<ICategoryCard> = ({ category }) => {
  const nav = useNavigate();
  return (
    <div
      onClick={() => nav(`/productsCatalog?category=${category.name}`)}
      className={styles.categoryCardContainer}
      style={{
        backgroundImage: `url(${category.imageUrl ? category.imageUrl : ""})`,
        backgroundSize: "cover",
      }}
    >
      <div className={styles.secondLayer}></div>
      <div className={styles.categoryNameContainer}>
        <p className={styles.categoryName}>{category.name}</p>
      </div>
    </div>
  );
};
