import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";
import { IProductGallery } from "./IProductGallery";
import { IProductVariant } from "./IProductVariant";

export interface IProductAdmin {
  id: number;
  name: string;
  buyPrice: number;
  sellPrice: number;
  description: string;
  state: boolean;
  genre: ProductGenre;
  categories: ICategory[];
  productGalleries: IProductGallery[];
  productVariants: IProductVariant[];
  deleted: boolean;
}
