import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";
import { IProductVariant } from "../ProductVariant/IProductVariant";
import { IProductGallery } from "./IProductGallery";

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
