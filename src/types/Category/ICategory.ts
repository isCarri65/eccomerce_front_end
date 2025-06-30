import { IType } from "../Type/IType";

export interface ICategory {
  id: number;
  name: string;
  imageUrl: string;
  type: IType;
}
