import { ProductGenre } from "./enums/ProductGenre";
import { IType } from "./Type/IType";

export type CategoryOptionSelect =
  | { kind: "genero"; value: string; param: ProductGenre } // tu enum Genero
  | { kind: "tipo"; value: string; param: IType }; // tu entidad Type
