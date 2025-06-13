import { useEffect, useState } from "react";
import { ICategory } from "../../../../types/Category/ICategory";
import { CategoryFormModal } from "../CategoryFormModal/CategoryFormModal";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../../../services/categoryService";
import { AdminLayout } from "../../../ui/admin/AdminLayout/AdminLayout";
import styles from "./CategoryListScreen.module.css";

export const CategoryListScreen = () => {
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => { fetchCategorias(); }, []);

  const fetchCategorias = async () => {
    const data = await getCategories();
    setCategorias(data);
  };

  const handleSubmit = async (data: Omit<ICategory, "id">) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
    setOpenModal(false);
    setEditingCategory(null);
    fetchCategorias();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteCategory(deletingId);
      setDeletingId(null);
      fetchCategorias();
    }
  };

  return (
    <AdminLayout>
      <CategoryFormModal
        open={openModal}
        onClose={() => { setOpenModal(false); setEditingCategory(null); }}
        onSubmit={handleSubmit}
        initialData={
          editingCategory
            ? { name: editingCategory.name, image: editingCategory.image }
            : undefined
        }
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
      />
      {deletingId && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <p>¿Seguro que deseas eliminar esta categoría?</p>
            <div>
              <button className={styles.btnAccionEliminar} onClick={handleDelete}>Sí, eliminar</button>
              <button className={styles.btnCancelar} onClick={() => setDeletingId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <h2 className={styles.titulo}>Categorías</h2>
      <div className={styles.topActions}>
        <button className={styles.btnNueva} type="button" onClick={() => setOpenModal(true)}>
          Nueva Categoría
        </button>
      </div>
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length === 0 ? (
              <tr className={styles.noDataRow}>
                <td colSpan={3}>No hay categorías disponibles.</td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.id}>
                <td>
                  {cat.image && (
                    <img src={cat.image} alt={cat.name} style={{ height: 40, borderRadius: 7 }} />
                  )}  
                </td>
                  <td>{cat.name}</td>
                  <td>
                    <button
                      className={styles.btnAccion}
                      onClick={() => { setEditingCategory(cat); setOpenModal(true); }}
                    >
                      Editar
                    </button>
                    <button
                      className={styles.btnAccionEliminar}
                      onClick={() => setDeletingId(cat.id)}
                    >
                      Eliminar
                    </button>
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
