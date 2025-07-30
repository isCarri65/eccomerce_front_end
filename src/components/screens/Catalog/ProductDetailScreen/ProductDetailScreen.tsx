import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProductDetailScreen.module.css";
import { IProduct } from "../../../../types/Product/IProduct";
import { addToCart } from "../../../../utils/cartUtils";
import {
  getProductById,
  getProductVariantsByProductId,
} from "../../../../api/services/ProductService";
import { useMessageStore } from "../../../../stores/messageStore";
import { IColor } from "../../../../types/Color/IColor";
import { ISize } from "../../../../types/Size/ISize";
import { IProductVariant } from "../../../../types/ProductVariant/IProductVariant";

export const ProductDetailScreen = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : -1;
  const { addMessage } = useMessageStore();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [productVariants, setProductVariants] = useState<IProductVariant[]>([]);

  const [colors, setColors] = useState<IColor[]>([]);
  const [sizes, setSizes] = useState<ISize[]>([]);

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productItem = await getProductById(productId);
        const variants = await getProductVariantsByProductId(productId);
        variants.map((e) => {
          console.log(e);
        });
        setProduct(productItem);
        setProductVariants(variants);
        const uniqueColorsMap = new Map<number, IColor>();
        const uniqueSizesMap = new Map<number, ISize>();

        variants.forEach((variant) => {
          uniqueColorsMap.set(variant.color.id, variant.color);
          uniqueSizesMap.set(variant.size.id, variant.size);
        });

        setColors(Array.from(uniqueColorsMap.values()));
        setSizes(Array.from(uniqueSizesMap.values()));
      } catch (err) {
        console.error("Error fetching product detail data:", err);
      }
    };

    if (productId !== -1) {
      fetchData();
    }
  }, [productId]);

  if (productId === -1)
    return (
      <div className={styles.loading}>
        Error en la carga, refresque la página o vuelva
      </div>
    );
  if (!product)
    return <div className={styles.loading}>Cargando producto...</div>;

  const availableColors = selectedSize
    ? colors.filter((color) =>
        productVariants.some(
          (variant) =>
            variant.size.id === selectedSize && variant.color.id === color.id
        )
      )
    : colors;

  const availableSizes = selectedColor
    ? sizes.filter((size) =>
        productVariants.some(
          (variant) =>
            variant.color.id === selectedColor && variant.size.id === size.id
        )
      )
    : sizes;

  const handleAddToCart = () => {
    if (selectedSize === null || selectedColor === null) {
      addMessage(
        "Por favor, seleccione un talle y un color antes de agregar al carrito.",
        "error"
      );
      return;
    }

    const variant = productVariants.find(
      (v) => v.size.id === selectedSize && v.color.id === selectedColor
    );
    if (!variant) {
      addMessage(
        "No existe una variante para el talle y color seleccionados.",
        "error"
      );
      return;
    }
    console.log(variant.id);
    addToCart({
      productVariantId: variant.id,
      quantity: 1,
    });

    addMessage("Producto agregado correctamente al carrito", "success");
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.leftColumn}>
        {product.productGalleries ? (
          <div>
            {product.productGalleries.map((image) => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={`imagen de ${product.name}`}
                className={styles.galleryImage}
              />
            ))}
          </div>
        ) : (
          <p>Image not found</p>
        )}
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.productName}>{product.name}</div>
        <div className={styles.productPrice}>
          ${product.price.toLocaleString()}
        </div>
        <div className={styles.productDesc}>{product.description}</div>

        <div className={styles.selectors}>
          <label>
            Talle:
            <select
              value={selectedSize ?? ""}
              onChange={(e) => setSelectedSize(Number(e.target.value))}
            >
              <option value="">Seleccione un talle</option>
              {availableSizes.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color:
            <select
              value={selectedColor ?? ""}
              onChange={(e) => setSelectedColor(Number(e.target.value))}
            >
              <option value="">Seleccione un color</option>
              {availableColors.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};
