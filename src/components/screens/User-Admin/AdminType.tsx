import React, { useEffect, useState } from 'react';
import { createType, deleteType, getAllTypes, updateType } from '../../../api/services/TypeService';
import { IType } from '../../../types/Type/IType';
interface TypeItem {
  id: number;
  name: string;
}


export const AdminType: React.FC = () => {
  const [types, setTypes] = useState<TypeItem[]>();
  const [showForm, setShowForm] = useState(false);
  const [editType, setEditType] = useState<TypeItem | null>(null);
  const [form, setForm] = useState({ name: '' });
  const loadTypes = async () => {
    try {
      const response = await getAllTypes();
      setTypes(response as unknown as TypeItem[]);
    } catch (error) {
      console.error("Error al cargar tipos", error);
    }
  };
  useEffect(() => { 
    loadTypes();
  }, []);
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
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteType(id);
      if (response) {
        setTypes((types) => types?.filter((t) => t.id !== id));
      } else {
        console.warn("El backend no confirmó el borrado del tipo");
      }
    } catch (error) {
      console.error("Error al eliminar tipo", error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ name: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editType) {
      try {
        const response = await updateType(editType?.id ?? 0, form as IType);
        setTypes((types) => types?.map((t) => t.id === editType?.id ? response as unknown as TypeItem : t));
      } catch (error) {
        console.error("Error al actualizar tipo", error);
      }
    } else {
      console.log(form, "form");
      try {
        const response = await createType({ name: form.name});
        setTypes((types) => [...types ?? [], response as unknown as TypeItem]);
      } catch (error) {
        console.error("Error al crear tipo", error);
      }
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
            {types?.map(type => (
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