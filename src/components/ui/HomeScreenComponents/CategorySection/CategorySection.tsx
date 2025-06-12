import { useState } from "react";
import { ICategory } from "../../../../types/Category/ICategory";
import { CategoryCard } from "../CategoryCard/CategoryCard";
import imageAMD from "../../../../assets/homeImages/fondo pc AMD.jpg";
import SimpleBar from "simplebar-react";
import styles from "./CategorySection.module.css";
import "./ScrollStyle.css";
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
  {
    id: "4",
    name: "Deporte",
    image: imageAMD,
  },
  {
    id: "5",
    name: "Zapatillas",
    image: imageAMD,
  },
  {
    id: "6",
    name: "Invierno",
    image: imageAMD,
  },
];
export const CategorySection = () => {
  const [categories, setCategories] = useState<ICategory[]>(categoryExample);
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
