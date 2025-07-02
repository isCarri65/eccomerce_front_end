import { IType } from "../Type/IType";

export interface ICategoryAdmin {
  id: number;
  name: string;
  imageUrl: string;
  publicId: string;
  deleted: boolean;
  tags: string[];

  type: IType;
}
