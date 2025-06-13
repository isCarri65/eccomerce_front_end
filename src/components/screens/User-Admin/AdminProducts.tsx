import React, { useEffect, useRef, useState } from 'react';
import styles from './AdminProducts.module.css';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../../api/services/ProductService';
import { getAllCategorys } from '../../../api/services/CategoryService';
import { getAllColors } from '../../../api/services/ColorService';
import { getAllSizes } from '../../../api/services/SizeService';
import { IProduct } from '../../../types/Product/IProduct';
import { ICategory } from '../../../types/Category/ICategory';
import { IColor } from '../../../types/Color/IColor';
import { ISize } from '../../../types/Size/ISize';
import { ProductGenre } from '../../../types/enums/ProductGenre';

const mockProducts: IProduct[] = [
  {
    id: 1,
    name: 'Nike Air Max',
    description: 'Zapatillas deportivas de alta calidad.',
    buyPrice: 100,
    sellPrice: 150,
    state: true,
    genre: ProductGenre.Male,
    categories: [{ id: 1, name: 'Calzado', image: '' }],
  },
  {
    id: 2,
    name: 'Adidas Run',
    description: 'Ideales para correr.',
    buyPrice: 80,
    sellPrice: 120,
    state: false,
    genre: ProductGenre.Male,
    categories: [{ id: 1, name: 'Calzado', image: '' }],
  },
  {
    id: 3,
    name: 'Remera Nike',
    description: 'Remera deportiva.',
    buyPrice: 30,
    sellPrice: 60,
    state: true,
    genre: ProductGenre.Male,
    categories: [{ id: 2, name: 'Ropa', image: '' }],
  },
];

const initialForm: any = {
  name: '',
  description: '',
  buyPrice: 0,
  sellPrice: 0,
  state: true,
  genre: ProductGenre.Male,
  categories: [],
  stock: 0,
  color: '',
  images: [],
  sizes: [],
};

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>(mockProducts);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [colors, setColors] = useState<IColor[]>([]);
  const [sizes, setSizes] = useState<ISize[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [sizeType, setSizeType] = useState<'LETTER' | 'NUMBER'>('LETTER');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getAllCategorys().then(setCategories);
    getAllColors().then(setColors);
    getAllSizes().then(setSizes);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categories.some(c => c.id === selectedCategory))
    : products;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(Number(e.target.value) || null);
  };

  const handleFormCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = Number(e.target.value);
    const cat = categories.find(c => c.id === catId);
    setForm((prev: any) => ({ ...prev, categories: cat ? [cat] : [] }));
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
    setForm({ ...product, stock: 0, color: '', images: [], sizes: [] });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setProducts(products => products.filter(p => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode && form.id) {
      setProducts(products => products.map(p => p.id === form.id ? { ...form, id: form.id } as IProduct : p));
    } else {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts(products => [...products, { ...form, id: newId, categories: form.categories || [] } as IProduct]);
    }
    setShowForm(false);
  };

  // Imagenes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setForm((prev: any) => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setForm((prev: any) => ({ ...prev, images: Array.from(e.dataTransfer.files) }));
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Talles
  const handleSizeTypeChange = (type: 'LETTER' | 'NUMBER') => {
    setSizeType(type);
    setForm((prev: any) => ({ ...prev, sizes: [] }));
    // Aquí deberías llamar a getSizes(type) si tu endpoint lo soporta
  };
  const handleSizeToggle = (id: number) => {
    setForm((prev: any) => {
      const exists = prev.sizes?.includes(id);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((sid: number) => sid !== id) : [...(prev.sizes || []), id],
      };
    });
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
          <div className={styles.formGrid}>
            <div className={styles.leftCol}>
              <div className={styles.formRow}><label>Nombre</label><input name="name" value={form.name || ''} onChange={handleChange} required /></div>
              <div className={styles.formRow}><label>Precio Compra</label><input name="buyPrice" type="number" value={form.buyPrice || 0} onChange={handleChange} required /></div>
              <div className={styles.formRow}><label>Precio Venta</label><input name="sellPrice" type="number" value={form.sellPrice || 0} onChange={handleChange} required /></div>
              <div className={styles.formRow}><label>Stock Inicial</label><input name="stock" type="number" value={form.stock || 0} onChange={handleChange} required /></div>
              <div className={styles.formRow}><label>Color</label>
                <select name="color" value={form.color || ''} onChange={handleColorChange} required>
                  <option value=''>Selecciona un color</option>
                  {colors.map(color => (
                    <option key={color.id} value={color.name}>{color.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formRow}><label>Habilitado</label>
                <select name="state" value={form.state ? '1' : '0'} onChange={e => setForm((f: any) => ({ ...f, state: e.target.value === '1' }))}>
                  <option value='1'>Sí</option>
                  <option value='0'>No</option>
                </select>
              </div>
              <div className={styles.formRow}><label>Categoría</label>
                <select name="category" value={form.categories?.[0]?.id || ''} onChange={handleFormCategoryChange} required>
                  <option value=''>Selecciona una categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.rightCol}>
              <div className={styles.formRow}><label>Descripción</label>
                <textarea name="description" value={form.description || ''} onChange={handleChange} className={styles.textareaDesc} required />
              </div>
              <div className={styles.formRow}><label>Imágenes</label>
                <div
                  className={styles.imageDrop}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.images && form.images.length > 0
                    ? <span>{form.images.length} imagen(es) seleccionada(s)</span>
                    : <span>Arrastra imágenes aquí o haz click para seleccionar</span>}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <label>Talles</label>
                <div className={styles.sizeSwitchRow}>
                  <button type="button" className={sizeType === 'NUMBER' ? styles.sizeSwitchActive : styles.sizeSwitch} onClick={() => handleSizeTypeChange('NUMBER')}>20-40</button>
                  <button type="button" className={sizeType === 'LETTER' ? styles.sizeSwitchActive : styles.sizeSwitch} onClick={() => handleSizeTypeChange('LETTER')}>XS-XL</button>
                </div>
                <div className={styles.sizesList}>
                  {sizes.filter(s => s.type === sizeType).map(size => (
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
            <button type="submit" className={styles.createBtn}>{editMode ? 'Aceptar' : 'Crear'}</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Regresar</button>
          </div>
        </form>
      )}
    </div>
  );
}; 