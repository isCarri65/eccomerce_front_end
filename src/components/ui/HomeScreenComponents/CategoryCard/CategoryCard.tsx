import { FC } from "react";
import { ICategory } from "../../../../types/Category/ICategory";
import styles from "./CategoryCard.module.css";
interface ICategoryCard {
  category: ICategory;
}
export const CategoryCard: FC<ICategoryCard> = ({ category }) => {
  return (
    <div className={styles.categoryCardConatainer}>
      <div className={styles.categoryName}>{category.name}</div>
      <div className={styles.categoryImgContainer}>
        <img src={category.image} alt={category.name} />
      </div>
    </div>
  );
};
