import { SizeType } from "./ISize";

export interface ISizeAdmin {
  id: number;
  name: string;
  type: SizeType;
  deleted: boolean;
}
