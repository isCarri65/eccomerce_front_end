import { useEffect, useState } from "react";
import { AdminLayout } from "../../../ui/admin/AdminLayout/AdminLayout";
import { DiscountFormModal } from "../DiscountFormModal/DiscountFormModal";
import { IDiscount } from "../../../../types/Promotion/IDiscount";
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from "../../../../services/discountService";
import styles from "./DiscountListScreen.module.css";

export const DiscountListScreen = () => {
  const [descuentos, setDescuentos] = useState<IDiscount[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<IDiscount | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { fetchDescuentos(); }, []);

  const fetchDescuentos = async () => {
    const data = await getDiscounts();
    setDescuentos(data);
  };

  const handleSubmit = async (data: Omit<IDiscount, "id">) => {
    if (editingDiscount) {
      await updateDiscount(editingDiscount.id, data);
    } else {
      await createDiscount(data);
    }
    setOpenModal(false);
    setEditingDiscount(null);
    fetchDescuentos();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteDiscount(deletingId);
      setDeletingId(null);
      fetchDescuentos();
    }
  };

  return (
    <AdminLayout>
      <DiscountFormModal
        open={openModal}
        onClose={() => { setOpenModal(false); setEditingDiscount(null); }}
        onSubmit={handleSubmit}
        initialData={
          editingDiscount
            ? {
                startDate: editingDiscount.startDate,
                endDate: editingDiscount.endDate,
                percentage: editingDiscount.percentage,
                state: editingDiscount.state,
              }
            : undefined
        }
        title={editingDiscount ? "Editar Descuento" : "Nuevo Descuento"}
      />
      {deletingId && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <p>¿Seguro que deseas eliminar este descuento?</p>
            <div>
              <button className={styles.btnAccionEliminar} onClick={handleDelete}>Sí, eliminar</button>
              <button className={styles.btnCancelar} onClick={() => setDeletingId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <h2 className={styles.titulo}>Descuentos</h2>
      <div className={styles.topActions}>
        <button
          className={styles.btnNuevo}
          type="button"
          onClick={() => { setEditingDiscount(null); setOpenModal(true); }}
        >
          Nuevo Descuento
        </button>
      </div>
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Porcentaje</th>
              <th>Vigencia</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {descuentos.length === 0 ? (
              <tr className={styles.noDataRow}>
                <td colSpan={4}>No hay descuentos disponibles.</td>
              </tr>
            ) : (
              descuentos.map((d) => (
                <tr key={d.id}>
                  <td>{d.percentage}%</td>
                  <td>
                    {d.startDate} - {d.endDate}
                  </td>
                  <td>
                    <span style={{ color: d.state ? "#38a169" : "#b71c1c" }}>
                      {d.state ? "Sí" : "No"}
                    </span>
                  </td>
                  <td>
                    <button className={styles.btnAccion} onClick={() => { setEditingDiscount(d); setOpenModal(true); }}>Editar</button>
                    <button className={styles.btnAccionEliminar} onClick={() => setDeletingId(d.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
