import React, { useEffect, useRef, useState } from "react";
import styles from "./AdminProducts.module.css";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../api/services/ProductService";
import { getAllCategorys } from "../../../api/services/CategoryService";
import { getAllColors } from "../../../api/services/ColorService";
import { getAllSizes } from "../../../api/services/SizeService";
import { IProduct } from "../../../types/Product/IProduct";
import { ICategory } from "../../../types/Category/ICategory";
import { IColor } from "../../../types/Color/IColor";
import { ISize } from "../../../types/Size/ISize";
import { ProductGenre } from "../../../types/enums/ProductGenre";

const initialForm: any = {
  name: "",
  description: "",
  buyPrice: 0,
  sellPrice: 0,
  state: true,
  genre: ProductGenre,
  categories: [],
  stock: 0,
  color: "",
  images: [],
  sizes: [],
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [sizeType, setSizeType] = useState<"LETTER" | "NUMBER">("LETTER");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response as unknown as IProduct[]);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    getAllCategorys()
      .then(setCategories)
      .catch((e) => console.error("Error al cargar categorías", e));

    getAllColors()
      .then(setColors)
      .catch((e) => console.error("Error al cargar colores", e));

    getAllSizes()
      .then(setSizes)
      .catch((e) => console.error("Error al cargar talles", e));

    loadProducts();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) =>
      p.categories?.some((c) => c.id === selectedCategory)
    )
    : products;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(Number(e.target.value) || null);
  };

  const handleFormCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = Number(e.target.value);
    setForm((prev: any) => ({ ...prev, categories: catId ? [catId] : [] }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev: any) => ({ ...prev, color: e.target.value }));
  };

  const handleCreate = () => {
    setForm(initialForm);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (product: IProduct) => {
    setForm({
      ...product,
      stock: product.stock ?? 0,
      color: (product as any).color ?? "",
      images: [],
      sizes:
        product.productVariants?.map((v: any) =>
          typeof v.sizeId === "number" ? v.sizeId : null
        ) ?? [],
      categories: product.categories?.map(c => c.id) ?? []
    });

    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const ok = await deleteProduct(id);
      if (ok) {
        setProducts((products) => products.filter((p) => p.id !== id));
      } else {
        console.warn("El backend no confirmó el borrado del producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto", error);
    }
  };

  const buildFormDataFromForm = (data: any): FormData => {
    const formData = new FormData();
    console.log(data, "data");
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("buyPrice", String(data.buyPrice));
    formData.append("sellPrice", String(data.sellPrice));
    formData.append("state", String(data.state));
    formData.append("genre", data.genre);
    formData.append("stock", String(data.stock ?? 0));
    formData.append("color", data.color ?? "");

    const categoryId = data.categories?.[0];
    if (categoryId) {
      formData.append("categoryId", String(categoryId));
    }

    if (data.sizes && data.sizes.length > 0) {
      formData.append("sizes", JSON.stringify(data.sizes));
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((file: File, index: number) => {
        formData.append("images", file);
        formData.append("imageNames", file.name); 
        formData.append("isMainFlags", index === 0 ? "true" : "false"); 
      });
    }
    

    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = buildFormDataFromForm(form);

      if (editMode && form.id) {
        await updateProduct(form.id, formData as any);
      } else {
        await createProduct(formData as any);
      }

      await loadProducts();
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar producto", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesImages = e.target.files;
    if (filesImages) {
      setForm((prev: any) => ({ ...prev, images: Array.from(filesImages) }));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setForm((prev: any) => ({
        ...prev,
        images: Array.from(e.dataTransfer.files),
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSizeTypeChange = (type: "LETTER" | "NUMBER") => {
    setSizeType(type);
    setForm((prev: any) => ({ ...prev, sizes: [] }));
  };

  const handleSizeToggle = (id: number) => {
    setForm((prev: any) => {
      const exists = prev.sizes?.includes(id);
      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((sid: number) => sid !== id)
          : [...(prev.sizes || []), id],
      };
    });
  };

  return (
    <div className={styles.adminProductsContainer}>
      {!showForm ? (
        <>
          <div className={styles.headerRow}>
            <div className={styles.headerActions}>
              <button className={styles.createBtn} onClick={handleCreate}>
                Crear Producto
              </button>
              <select
                className={styles.categorySelect}
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table
              className={styles.table}
              style={{ width: "70vw", minWidth: 600, maxWidth: 1200 }}
            >
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Imagen</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>

                    <td>
                      {/* Imagen desde productGalleries */}
                      {product.productGalleries && product.productGalleries.length > 0 ? (
                        <img
                          src={product.productGalleries[0].imageUrl}
                          alt={product.name}
                          className={styles.thumbnail}
                        />
                      ) : product.imageUrl ? (
                        /* Imagen desde imageUrl plano del backend */
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={styles.thumbnail}
                        />
                      ) : (
                        <span className={styles.noImage}>Sin imagen</span>
                      )}
                    </td>


                    <td>${product.buyPrice}</td>
                    <td>${product.sellPrice}</td>

                    <td>
                      {product.categories?.map((c) => c.name).join(", ")}
                    </td>

                    <td>{product.stock ?? "-"}</td>

                    <td>{product.state ? "Activo" : "Inactivo"}</td>

                    <td>
                      <button
                        className={styles.editBtn}
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <h2>{editMode ? "Editar Producto" : "Crear Producto"}</h2>

          <div className={styles.formGrid}>
            <div className={styles.leftCol}>
              <div className={styles.formRow}>
                <label>Nombre</label>
                <input
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <label>Género</label>
                <select
                  name="genre"
                  value={form?.genre || ProductGenre.MALE}
                  onChange={handleChange}
                  required
                >
                  <option value={ProductGenre.MALE}>Masculino</option>
                  <option value={ProductGenre.FEMALE}>Femenino</option>
                  <option value={ProductGenre.UNISEX}>Unisex</option>
                  <option value={ProductGenre.CHILDREN}>Niños</option>
                </select>
              </div>
              <div className={styles.formRow}>
                <label>Precio Compra</label>
                <input
                  name="buyPrice"
                  type="number"
                  value={form.buyPrice || 0}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Precio Venta</label>
                <input
                  name="sellPrice"
                  type="number"
                  value={form.sellPrice || 0}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Stock Inicial</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock || 0}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Color</label>
                <select
                  name="color"
                  value={form.color || ""}
                  onChange={handleColorChange}
                  required
                >
                  <option value="">Selecciona un color</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.name}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formRow}>
                <label>Habilitado</label>
                <select
                  name="state"
                  value={form.state ? "1" : "0"}
                  onChange={(e) =>
                    setForm((f: any) => ({
                      ...f,
                      state: e.target.value === "1",
                    }))
                  }
                >
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <label>Categoría</label>
                <select
                  name="category"
                  value={form.categories?.[0] || ""}
                  onChange={handleFormCategoryChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.rightCol}>
              <div className={styles.formRow}>
                <label>Descripción</label>
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  className={styles.textareaDesc}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Imágenes</label>
                <div
                  className={styles.imageDrop}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.images && form.images.length > 0 ? (
                    <span>{form.images.length} imagen(es) seleccionada(s)</span>
                  ) : (
                    <span>
                      Arrastra imágenes aquí o haz click para seleccionar
                    </span>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Talles</label>

                <div className={styles.sizeSwitchRow}>
                  <button
                    type="button"
                    className={
                      sizeType === "NUMBER"
                        ? styles.sizeSwitchActive
                        : styles.sizeSwitch
                    }
                    onClick={() => handleSizeTypeChange("NUMBER")}
                  >
                    20-40
                  </button>

                  <button
                    type="button"
                    className={
                      sizeType === "LETTER"
                        ? styles.sizeSwitchActive
                        : styles.sizeSwitch
                    }
                    onClick={() => handleSizeTypeChange("LETTER")}
                  >
                    XS-XL
                  </button>
                </div>

                <div className={styles.sizesList}>
                  {sizes
                    .filter((s) => s.type === sizeType)
                    .map((size) => (
                      <label key={size.id} className={styles.sizeCheckbox}>
                        <input
                          type="checkbox"
                          checked={form.sizes?.includes(size.id)}
                          onChange={() => handleSizeToggle(size.id)}
                        />
                        {size.name}
                      </label>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.createBtn}>
              {editMode ? "Aceptar" : "Crear"}
            </button>

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setShowForm(false)}
            >
              Regresar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
