import { IType } from "../type/IType";

export interface ICategoryAdmin {
  id: number;
  name: string;
  imageUrl: string;
  publicId: string;
  deleted: boolean;
  type: IType;
}
