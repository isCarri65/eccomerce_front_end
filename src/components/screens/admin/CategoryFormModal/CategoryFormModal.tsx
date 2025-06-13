import styles from "./CategoryFormModal.module.css";
import { useState, useEffect } from "react";
import { ICategory } from "../../../../types/Category/ICategory";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ICategory, "id">) => void;
  initialData?: Omit<ICategory, "id">;
  title?: string;
}

export const CategoryFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Nueva Categoría",
}: Props) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImage(initialData.image);
    } else {
      setName("");
      setImage("");
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, image });
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
            <label>Nombre de la categoría</label>
            <input name="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className={styles.campo}>
            <label>URL de la imagen</label>
            <input name="image" value={image} onChange={e => setImage(e.target.value)} required />
          </div>
          {image && (
            <img src={image} alt="Vista previa" style={{ height: 50, marginTop: 8, borderRadius: 6 }} />
          )}
          <div className={styles.actionsRow}>
            <button className={styles.btnGuardar} type="submit">Guardar</button>
            <button className={styles.btnCancelar} type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
