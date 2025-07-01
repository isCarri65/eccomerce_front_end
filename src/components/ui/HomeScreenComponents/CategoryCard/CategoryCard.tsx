import { FC } from "react";
import { ICategory } from "../../../../types/Category/ICategory";
import styles from "./CategoryCard.module.css";
interface ICategoryCard {
  category: ICategory;
}
export const CategoryCard: FC<ICategoryCard> = ({ category }) => {
  return (
    <div
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
