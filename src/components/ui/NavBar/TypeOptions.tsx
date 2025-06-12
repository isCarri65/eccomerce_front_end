import { FC } from "react";
import { IType } from "../../../types/Type/IType";
import styles from "./TypeOptions.module.css";
import { useCategories } from "../../../hooks/useCategories";
import { useTypes } from "../../../hooks/useTypes";

interface ITypeOptionsProps {
  type: IType;
}

export const TypeOptions: FC<ITypeOptionsProps> = ({ type }) => {
  const { types } = useTypes();
  const { categories } = useCategories();
  return (
    <div className={styles.typeOptionContainer}>
      {type.name === "Deportes" ? <div>Deprtes</div> : <div>otro</div>}
      <div>{type.name}</div>
      <div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
