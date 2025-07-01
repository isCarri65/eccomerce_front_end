import { useEffect, useState } from "react";
import { ICategory } from "../../../../types/Category/ICategory";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import SimpleBar from "simplebar-react";
import styles from "./CategorySection.module.css";
import "./ScrollStyle.css";
import { getAllCategorys } from "../../../../api/services/CategoryService";

export const CategorySection = () => {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  useEffect(() => {
  
    const fetchProducts = async () => {
      try {
        const response = await getAllCategorys();
        setCategories(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []);
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Categorías</h2>
      </div>

      <SimpleBar
        style={{ height: "100%" }}
        forceVisible="y"
        autoHide={false}
        className="w-[90%] md:w-[80%]  lg:w-[66%] xl:w-[66%] "
      >
        <div className={styles.categoryContainer + " sm:grid-cols-1"}>
          {categories ? categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          )) : ("Cargando categorias...")}
        </div>
      </SimpleBar>
    </div>
  );
};
