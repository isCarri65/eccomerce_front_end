export type SizeType = "NUMBER" | "LETTER";

export interface ISize {
  id: number;
  name: string;
  type: SizeType;
}
