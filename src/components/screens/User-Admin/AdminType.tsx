import React, { useState } from 'react';

interface TypeItem {
  id: number;
  name: string;
}

const mockTypes: TypeItem[] = [
  { id: 1, name: 'Deportivo' },
  { id: 2, name: 'Casual' },
];

export const AdminType: React.FC = () => {
  const [types, setTypes] = useState<TypeItem[]>(mockTypes);
  const [showForm, setShowForm] = useState(false);
  const [editType, setEditType] = useState<TypeItem | null>(null);
  const [form, setForm] = useState({ name: '' });

  const handleCreate = () => {
    setForm({ name: '' });
    setEditType(null);
    setShowForm(true);
  };
  const handleEdit = (type: TypeItem) => {
    setForm({ name: type.name });
    setEditType(type);
    setShowForm(true);
  };
  const handleDelete = (id: number) => {
    setTypes(types => types.filter(t => t.id !== id));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editType) {
      setTypes(types => types.map(t => t.id === editType.id ? { ...t, name: form.name } : t));
    } else {
      setTypes(types => [...types, { id: types.length + 1, name: form.name }]);
    }
    setShowForm(false);
  };
  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, width: 400, maxWidth: '95vw', margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Tipos</h2>
      {!showForm ? (
        <>
          <button style={{ background: '#22223b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer', marginBottom: 18 }} onClick={handleCreate}>Crear Tipo</button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {types.map(type => (
              <li key={type.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid #eee' }}>
                <span>{type.name}</span>
                <span>
                  <button style={{ background: '#ffd600', color: '#22223b', border: 'none', borderRadius: 6, padding: '0.4rem 1.1rem', fontWeight: 600, marginRight: 8, cursor: 'pointer' }} onClick={() => handleEdit(type)}>Editar</button>
                  <button style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4rem 1.1rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => handleDelete(type.id)}>Eliminar</button>
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label>Nombre del tipo<input value={form.name} onChange={handleChange} required style={{ marginTop: 4 }}/></label>
          <div style={{ display: 'flex', gap: 16, marginTop: 18, justifyContent: 'center' }}>
            <button type="submit" style={{ background: '#22223b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }}>Guardar</button>
            <button type="button" style={{ background: '#bdbdbd', color: '#22223b', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}; 