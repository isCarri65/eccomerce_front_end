import { IDiscount } from "../../../../types/Promotion/IDiscount";
import styles from "./DiscountFormModal.module.css";
import { useState, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IDiscount, "id">) => void;
  initialData?: Omit<IDiscount, "id">;
  title?: string;
}

export const DiscountFormModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
  title = "Nuevo Descuento",
}: Props) => {
  const [discount, setDiscount] = useState<Omit<IDiscount, "id">>({
    startDate: "",
    endDate: "",
    percentage: 0,
    state: true,
  });

  useEffect(() => {
    if (initialData) setDiscount(initialData);
    else setDiscount({
      startDate: "",
      endDate: "",
      percentage: 0,
      state: true,
    });
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDiscount((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(discount);
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
            <label>Porcentaje</label>
            <input name="percentage" type="number" value={discount.percentage} onChange={handleChange} required />
          </div>
          <div className={styles.campo}>
            <label>Fecha Inicio</label>zz
            <input name="startDate" type="date" value={discount.startDate} onChange={handleChange} required />
          </div>
          <div className={styles.campo}>
            <label>Fecha Fin</label>
            <input name="endDate" type="date" value={discount.endDate} onChange={handleChange} required />
          </div>
          <div className={styles.campoRow}>
            <label>Activo</label>
            <input type="checkbox" name="state" checked={discount.state} onChange={handleChange} />
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
