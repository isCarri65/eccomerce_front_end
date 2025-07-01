import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";
import { IProductGallery } from "./IProductGallery";
import { IProductVariant } from "./IProductVariant";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  genre: ProductGenre;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockAvailable: boolean;
  categories: ICategory[];
  productGalleries: IProductGallery[];
  productVariants: IProductVariant[];
}
