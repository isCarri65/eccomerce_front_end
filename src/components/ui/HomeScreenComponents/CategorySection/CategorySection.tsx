import { useEffect } from "react";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import SimpleBar from "simplebar-react";
import styles from "./CategorySection.module.css";
import "./ScrollStyle.css";
import { useCategories } from "../../../../hooks/useCategories";

export const CategorySection = () => {
  const { fetchCategories, categories } = useCategories();
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Categorías</h2>
      </div>

      <SimpleBar
        style={{ height: "80vh" }}
        forceVisible="y"
        autoHide={false}
        className="w-[90%] md:w-[80%]  lg:w-[66%] xl:w-[66%] "
      >
        <div className={styles.categoryContainer + " sm:grid-cols-1"}>
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </SimpleBar>
    </div>
  );
};
