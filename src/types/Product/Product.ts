export interface ProductGallery {
  id: number;
  productId: number;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  buyPrice: number;
  sellPrice: number;
  state: boolean;
  color: string;
  categories: { categoryId: number }[]; // Sólo los ids de categoría
  gallery: ProductGallery[];
}
