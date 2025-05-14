import { useState } from "react";
import styles from "./CategorySection.module.css";
import { ICategory } from "../../../../types/Category/ICategory";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import imageAMD from "../../../../assets/homeImages/fondo pc AMD.jpg";
import ScrollableSection from "../ScrollableSection/ScrollableSection";
const categoryExample: ICategory[] = [
  {
    id: "1",
    name: "Hombre",
    image: imageAMD,
  },
  {
    id: "2",
    name: "Mujer",
    image: imageAMD,
  },
  {
    id: "3",
    name: "Niño/a",
    image: imageAMD,
  },
];
export const CategorySection = () => {
  const [categories, setCategories] = useState<ICategory[]>(categoryExample);
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title + ` text-4xl`}>Categorías</h2>
      </div>
      <div className={styles.categorySectionContainer}>
        <div className={styles.categoryContainer}>
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
        <div>
          <ScrollableSection />
        </div>
      </div>
    </div>
  );
};
