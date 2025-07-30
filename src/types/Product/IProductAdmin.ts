import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";
import { IProductVariant } from "../ProductVariant/IProductVariant";
import { IProductGallery } from "./IProductGallery";

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
