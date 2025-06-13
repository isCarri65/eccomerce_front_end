import React, { useState } from 'react';

interface CategoryItem {
  id: number;
  name: string;
}

const mockCategories: CategoryItem[] = [
  { id: 1, name: 'Calzado' },
  { id: 2, name: 'Ropa' },
];

export const AdminCategory: React.FC = () => {
  const [categories, setCategories] = useState<CategoryItem[]>(mockCategories);
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryItem | null>(null);
  const [form, setForm] = useState({ name: '' });

  const handleCreate = () => {
    setForm({ name: '' });
    setEditCategory(null);
    setShowForm(true);
  };
  const handleEdit = (cat: CategoryItem) => {
    setForm({ name: cat.name });
    setEditCategory(cat);
    setShowForm(true);
  };
  const handleDelete = (id: number) => {
    setCategories(categories => categories.filter(c => c.id !== id));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCategory) {
      setCategories(categories => categories.map(c => c.id === editCategory.id ? { ...c, name: form.name } : c));
    } else {
      setCategories(categories => [...categories, { id: categories.length + 1, name: form.name }]);
    }
    setShowForm(false);
  };
  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, width: 400, maxWidth: '95vw', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Categorías</h2>
      {!showForm ? (
        <>
          <button style={{ background: '#22223b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', marginBottom: 18 }} onClick={handleCreate}>Crear Categoría</button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {categories.map(cat => (
              <li key={cat.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid #eee' }}>
                <span>{cat.name}</span>
                <span>
                  <button style={{ background: '#ffd600', color: '#22223b', border: 'none', borderRadius: 6, padding: '0.4rem 1.1rem', fontWeight: 600, marginRight: 8, cursor: 'pointer' }} onClick={() => handleEdit(cat)}>Editar</button>
                  <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1.1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleDelete(cat.id)}>Eliminar</button>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label>Nombre de la categoría<input value={form.name} onChange={handleChange} required style={{ marginTop: 4 }}/></label>
          <div style={{ display: 'flex', gap: 16, marginTop: 18, justifyContent: 'center' }}>
            <button type="submit" style={{ background: '#22223b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }}>Guardar</button>
            <button type="button" style={{ background: '#bdbdbd', color: '#22223b', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}; 