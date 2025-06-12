import { FC } from "react";
import { ProductGenre } from "../../../types/enums/ProductGenre";

interface IGenreOptionsProps {
  genre: ProductGenre;
}
export const GenreOptions: FC<IGenreOptionsProps> = ({ genre }) => {
  return <div>GenreOptions</div>;
};
