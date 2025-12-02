import { ICategory } from "../Category/ICategory";
import { ProductGenre } from "../enums/ProductGenre";
import { IProductGallery } from "../ProductGallery/IProductGallery";

export interface IProductList {
  id: number;
  name: string;
  description: string;
  productGalleries: IProductGallery[];
  genre: ProductGenre;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stockAvailable: boolean;
  categories: ICategory[];
  imageUrl: string;
}
