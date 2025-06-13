import { useState, useEffect } from "react";
import { Product } from "../../../../types/Product/Product";
import { ICategory } from "../../../../types/Category/ICategory";
import styles from "./ProductFormModal.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, "id">) => void;
  initialData?: Omit<Product, "id">;
  categorias: ICategory[];
  title?: string;
}

export const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  categorias,
  title = "Nuevo Producto",
}: Props) => {
  const [name, setName] = useState("");
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [state, setState] = useState(true);
  const [color, setColor] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [description, setDescription] = useState<string | undefined>("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setBuyPrice(initialData.buyPrice);
      setSellPrice(initialData.sellPrice);
      setState(initialData.state);
      setColor(initialData.color);
      setDescription(initialData.description);
      setGallery(initialData.gallery ? initialData.gallery.map(g => g.image) : []);
      setCategoryId(
        initialData.categories && initialData.categories.length > 0
          ? initialData.categories[0].categoryId
          : ""
      );
    } else {
      setName("");
      setBuyPrice(0);
      setSellPrice(0);
      setState(true);
      setColor("");
      setDescription("");
      setGallery([]);
      setCategoryId("");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Omit<Product, "id"> = {
      name,
      buyPrice,
      sellPrice,
      state,
      color,
      description,
      categories: categoryId === "" ? [] : [{ categoryId: Number(categoryId) }],
      gallery: gallery.map(img => ({
        id: 0, // o undefined, el backend lo setea
        productId: 0,
        image: img,
      })),
    };
    onSubmit(data);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.headerRow}>
          <h2 className={styles.titulo}>{title}</h2>
          <button className={styles.btnCerrar} type="button" onClick={onClose}>×</button>
        </div>
        <form className={styles.formulario} onSubmit={handleSubmit}>
          <div className={styles.campo}>
            <label>Nombre</label>
            <input name="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.campo}>
            <label>Categoría</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.row}>
            <div className={styles.campo}>
              <label>Precio Compra</label>
              <input name="buyPrice" type="number" value={buyPrice} onChange={e => setBuyPrice(Number(e.target.value))} required />
            </div>
            <div className={styles.campo}>
              <label>Precio Venta</label>
              <input name="sellPrice" type="number" value={sellPrice} onChange={e => setSellPrice(Number(e.target.value))} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.campo}>
              <label>Color</label>
              <input name="color" value={color} onChange={e => setColor(e.target.value)} required />
            </div>
            <div className={styles.campoRow}>
              <label>Habilitado</label>
              <input type="checkbox" name="state" checked={state} onChange={e => setState(e.target.checked)} />
            </div>
          </div>
          <div className={styles.campo}>
            <label>Descripción</label>
            <input name="description" value={description ?? ""} onChange={e => setDescription(e.target.value)} />
          </div>
          {/* GALLERY: imágenes del producto */}
          <div className={styles.campo}>
            <label>Imágenes (URL, una por campo):</label>
            {gallery.map((img, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: 5 }}>
                <input
                  type="text"
                  value={img}
                  onChange={e => {
                    const next = [...gallery];
                    next[idx] = e.target.value;
                    setGallery(next);
                  }}
                  placeholder="https://.../img.png"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}>🗑️</button>
                {img && <img src={img} alt="preview" style={{ height: 40, borderRadius: 7, marginLeft: 8 }} />}
              </div>
            ))}
            <button type="button" onClick={() => setGallery([...gallery, ""])}>Agregar imagen</button>
          </div>
          <div className={styles.actionsRow}>
            <button className={styles.btnGuardar} type="submit">Guardar</button>
            <button className={styles.btnCancelar} type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
