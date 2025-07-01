export interface IProductGalleryAdmin {
  id: number;
  name: string;
  imageUrl: string;
  isMain: boolean;
  productId: number;
  publicId: string;
  deleted: boolean;
}
