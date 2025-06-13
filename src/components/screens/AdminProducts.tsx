import React, { useEffect, useState } from 'react';
import styles from './AdminProducts.module.css';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/services/ProductService';
import { getAllCategorys } from '../../api/services/CategoryService';
import { IProduct } from '../../types/Product/IProduct';
import { ICategory } from '../../types/Category/ICategory';

const mockProducts: IProduct[] = [
  {
    id: 1,
    name: 'Nike Air Max',
    description: 'Zapatillas deportivas de alta calidad.',
    buyPrice: 100,
    sellPrice: 150,
    state: true,
    genre: undefined,
    categories: [{ id: 1, name: 'Calzado', image: '' }],
  },
  {
    id: 2,
    name: 'Adidas Run',
    description: 'Ideales para correr.',
    buyPrice: 80,
    sellPrice: 120,
    state: false,
    genre: undefined,
    categories: [{ id: 1, name: 'Calzado', image: '' }],
  },
  {
    id: 3,
    name: 'Remera Nike',
    description: 'Remera deportiva.',
    buyPrice: 30,
    sellPrice: 60,
    state: true,
    genre: undefined,
    categories: [{ id: 2, name: 'Ropa', image: '' }],
  },
];

const initialForm: Partial<IProduct> = {
  name: '',
  description: '',
  buyPrice: 0,
  sellPrice: 0,
  state: true,
  genre: undefined,
  categories: [],
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>(mockProducts);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Partial<IProduct>>(initialForm);

  useEffect(() => {
    // getAllProducts().then(setProducts);
    getAllCategorys().then(setCategories);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categories.some(c => c.id === selectedCategory))
    : products;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(Number(e.target.value) || null);
  };

  const handleFormCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = Number(e.target.value);
    const cat = categories.find(c => c.id === catId);
    setForm(prev => ({ ...prev, categories: cat ? [cat] : [] }));
  };

  const handleCreate = () => {
    setForm(initialForm);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (product: IProduct) => {
    setForm(product);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setProducts(products => products.filter(p => p.id !== id));
    // await deleteProduct(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && form.id) {
      setProducts(products => products.map(p => p.id === form.id ? { ...form, id: form.id } as IProduct : p));
      // const updated = await updateProduct(form.id, form as IProduct);
      // setProducts(products => products.map(p => p.id === form.id ? updated : p));
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts(products => [...products, { ...form, id: newId, categories: form.categories || [] } as IProduct]);
      // const created = await createProduct(form as IProduct);
      // setProducts(products => [...products, created]);
    }
    setShowForm(false);
  };

  return (
    <div className={styles.adminProductsContainer}>
      {!showForm ? (
        <>
          <div className={styles.headerRow}>
            <div className={styles.headerActions}>
              <button className={styles.createBtn} onClick={handleCreate}>Crear Producto</button>
              <select className={styles.categorySelect} value={selectedCategory || ''} onChange={handleCategoryChange}>
                <option value=''>Todas las categorías</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table} style={{ width: '70vw', minWidth: 600, maxWidth: 1200 }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Compra</th>
                  <th>Precio Venta</th>
                  <th>Categoría</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>${product.buyPrice}</td>
                    <td>${product.sellPrice}</td>
                    <td>{product.categories.map(c => c.name).join(', ')}</td>
                    <td>-</td>
                    <td>{product.state ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      <button className={styles.editBtn} onClick={() => handleEdit(product)}>Editar</button>
                      <button className={styles.deleteBtn} onClick={() => handleDelete(product.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <h2>{editMode ? 'Editar Producto' : 'Crear Producto'}</h2>
          <div className={styles.formRow}>
            <label>Nombre</label>
            <input name="name" value={form.name || ''} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Descripción</label>
            <input name="description" value={form.description || ''} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Precio Compra</label>
            <input name="buyPrice" type="number" value={form.buyPrice || 0} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Precio Venta</label>
            <input name="sellPrice" type="number" value={form.sellPrice || 0} onChange={handleChange} required />
          </div>
          <div className={styles.formRow}>
            <label>Categoría</label>
            <select name="category" value={form.categories?.[0]?.id || ''} onChange={handleFormCategoryChange} required>
              <option value=''>Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <label>Estado</label>
            <select name="state" value={form.state ? '1' : '0'} onChange={e => setForm(f => ({ ...f, state: e.target.value === '1' }))}>
              <option value='1'>Activo</option>
              <option value='0'>Inactivo</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.createBtn}>{editMode ? 'Aceptar' : 'Crear'}</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Regresar</button>
          </div>
        </form>
      )}
    </div>
  );
}; 