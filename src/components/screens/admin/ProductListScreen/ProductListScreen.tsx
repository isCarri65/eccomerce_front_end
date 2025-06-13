import { useEffect, useState } from "react";
import { Product } from "../../../../types/Product/Product";
import { ICategory } from "../../../../types/Category/ICategory";
import { AdminLayout } from "../../../ui/admin/AdminLayout/AdminLayout";
import { ProductFormModal } from "../ProductFormModal/ProductFormModal";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../../../services/productService";
import { getCategories } from "../../../../services/categoryService";
import styles from "./ProductListScreen.module.css";

export const ProductListScreen = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [categorias, setCategorias] = useState<ICategory[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | "">("");
  const [openModal, setOpenModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const fetchProductos = async () => {
    const data = await getProducts();
    setProductos(data);
  };

  const fetchCategorias = async () => {
    const data = await getCategories();
    setCategorias(data);
  };

  const handleSubmit = async (data: Omit<Product, "id">) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, data);
    } else {
      await createProduct(data);
    }
    setOpenModal(false);
    setEditingProduct(null);
    fetchProductos();
  };

  const handleDelete = async () => {
    if (deletingId !== null) {
      await deleteProduct(deletingId);
      setDeletingId(null);
      fetchProductos();
    }
  };

  // Obtiene el nombre de la primera categoría asociada
  const getCategoriaNombre = (product: Product) => {
    if (product.categories && product.categories.length > 0) {
      const cat = categorias.find(c => c.id === product.categories[0].categoryId);
      return cat?.name || "Sin categoría";
    }
    return "Sin categoría";
  };

  return (
    <AdminLayout>
      <ProductFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingProduct || undefined}
        categorias={categorias}
        title={editingProduct ? "Editar Producto" : "Nuevo Producto"}
      />
      {/* Modal confirmación eliminación */}
      {deletingId !== null && (
        <div className={styles.overlay}>
          <div className={styles.deleteModal}>
            <p>¿Seguro que deseas eliminar este producto?</p>
            <div>
              <button className={styles.btnAccionEliminar} onClick={handleDelete}>Sí, eliminar</button>
              <button className={styles.btnCancelar} onClick={() => setDeletingId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <h2 className={styles.titulo}>Productos</h2>
      <div className={styles.topActions}>
        <select
          className={styles.selectCategoria}
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value === "" ? "" : Number(e.target.value))}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          className={styles.inputBusqueda}
          type="text"
          placeholder="Buscar producto"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button
          className={styles.btnNuevo}
          type="button"
          onClick={() => {
            setEditingProduct(null);
            setOpenModal(true);
          }}
        >
          Crear Producto
        </button>
      </div>
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Categoría</th>
              <th>Color</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr className={styles.noDataRow}>
                <td colSpan={7}>No hay productos disponibles.</td>
              </tr>
            ) : (
              productos
                .filter((p) =>
                  p.name.toLowerCase().includes(busqueda.toLowerCase()) &&
                  (categoriaSeleccionada === "" ||
                    (p.categories && p.categories.some(cat => cat.categoryId === categoriaSeleccionada)))
                )
                .map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.name}</td>
                    <td>{producto.buyPrice}</td>
                    <td>{producto.sellPrice}</td>
                    <td>{getCategoriaNombre(producto)}</td>
                    <td>{producto.color}</td>
                    <td>{producto.state ? "Habilitado" : "Deshabilitado"}</td>
                    <td>
                      <button
                        className={styles.btnAccion}
                        onClick={() => {
                          setEditingProduct(producto);
                          setOpenModal(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className={styles.btnAccionEliminar}
                        onClick={() => setDeletingId(producto.id)}
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
