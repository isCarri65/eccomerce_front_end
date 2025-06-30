import { ICreateProductGallery } from "../ProductGallery/ICreateProductGallery";

export interface ICreateProduct {
  name: string;
  buyPrice: number;
  sellPrice: number;
  description: string;
  state: boolean;
  genre: string;
  categories: number[];
  productGalleries?: ICreateProductGallery[];
}
