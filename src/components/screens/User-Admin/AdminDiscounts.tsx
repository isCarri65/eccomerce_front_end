import React, { useEffect, useState } from 'react';
import styles from './AdminDiscounts.module.css';
import { ICategory } from '../../../types/Category/ICategory';

// Mock de descuentos para desarrollo
const mockDiscounts = [
  {
    id: 1,
    percentage: 20,
    product: { name: 'Nike Air Max' },
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    category: { id: 1, name: 'Calzado' },
    state: true,
  },
  {
    id: 2,
    percentage: 10,
    product: { name: 'Remera Nike' },
    startDate: '2024-06-10',
    endDate: '2024-07-10',
    category: { id: 2, name: 'Ropa' },
    state: false,
  },
];

const mockCategories: ICategory[] = [
  { id: 1, name: 'Calzado', image: '' },
  { id: 2, name: 'Ropa', image: '' },
  { id: 3, name: 'Accesorios', image: '' },
  { id: 4, name: 'Cat 4', image: '' },
];

export const AdminDiscounts: React.FC = () => {
  const [discounts, setDiscounts] = useState<any[]>(mockDiscounts);
  const [categories, setCategories] = useState<ICategory[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [stateFilter, setStateFilter] = useState<'active' | 'inactive'>('active');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ percentage: '', startDate: '', endDate: '', categories: [] as number[] });

  const filteredDiscounts = discounts.filter(d =>
    (stateFilter === 'active' ? d.state : !d.state) &&
    (selectedCategory ? d.category.id === selectedCategory : true)
  );

  const handleToggle = (id: number) => {
    setDiscounts(discounts =>
      discounts.map(d =>
        d.id === id ? { ...d, state: !d.state } : d
      )
    );
  };

  const handleCategoryCheck = (id: number) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter(cid => cid !== id)
        : [...f.categories, id],
    }));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular alta y volver al listado
    setDiscounts(discounts => [
      ...discounts,
      {
        id: discounts.length + 1,
        percentage: form.percentage,
        product: { name: 'Nuevo Descuento' },
        startDate: form.startDate,
        endDate: form.endDate,
        category: categories.find(c => c.id === form.categories[0]) || { id: 0, name: '', image: '' },
        state: true,
      },
    ]);
    setShowForm(false);
    setForm({ percentage: '', startDate: '', endDate: '', categories: [] });
  };

  return (
    <div className={styles.adminDiscountsContainer}>
      <h1 className={styles.title}>Descuentos</h1>
      {!showForm ? (
        <>
          <div className={styles.filtersRow}>
            <select
              className={styles.filterSelect}
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value as 'active' | 'inactive')}
            >
              <option value="active">Filtro: Activos</option>
              <option value="inactive">Filtro: Inactivos</option>
            </select>
            <select
              className={styles.filterSelect}
              value={selectedCategory || ''}
              onChange={e => setSelectedCategory(Number(e.target.value) || null)}
            >
              <option value="">Filtro: Categoría</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button className={styles.createBtn} onClick={() => setShowForm(true)}>Crear Descuento</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Descuento %</th>
                  <th>Producto</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Categoría</th>
                  <th>Deshabilitar</th>
                </tr>
              </thead>
              <tbody>
                {filteredDiscounts.map(d => (
                  <tr key={d.id}>
                    <td>{d.percentage}%</td>
                    <td>{d.product.name}</td>
                    <td>{d.startDate}</td>
                    <td>{d.endDate}</td>
                    <td>{d.category.name}</td>
                    <td>
                      <label className={styles.switch}>
                        <input type="checkbox" checked={d.state} onChange={() => handleToggle(d.id)} />
                        <span className={styles.slider}></span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <form className={styles.discountForm} onSubmit={handleFormSubmit}>
          <div className={styles.discountFormGrid}>
            <div className={styles.discountFormLeft}>
              <div className={styles.formRow}><label>Descuento</label><input name="percentage" value={form.percentage} onChange={handleFormChange} required placeholder="%" /></div>
              <div className={styles.formRow}><label>Fecha Inicio</label><input name="startDate" value={form.startDate} onChange={handleFormChange} required placeholder="__/__/__" /></div>
              <div className={styles.formRow}><label>Fecha Fin</label><input name="endDate" value={form.endDate} onChange={handleFormChange} required placeholder="__/__/__" /></div>
            </div>
            <div className={styles.discountFormRight}>
              <div className={styles.formRow}><label>Categorías</label>
                <div className={styles.categoryList}>
                  {categories.map(cat => (
                    <label key={cat.id} className={styles.categoryCheckbox}>
                      <input
                        type="checkbox"
                        checked={form.categories.includes(cat.id)}
                        onChange={() => handleCategoryCheck(cat.id)}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.discountFormActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Regresar</button>
            <button type="submit" className={styles.createBtn}>Aceptar</button>
          </div>
        </form>
      )}
    </div>
  );
}; 