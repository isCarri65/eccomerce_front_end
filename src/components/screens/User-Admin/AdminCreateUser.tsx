import React, { useState } from 'react';

interface Props {
  onBack?: () => void;
}

export const AdminCreateUser: React.FC<Props> = ({ onBack }) => {
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se llamaría al endpoint de crear usuario
    alert('Usuario creado (simulado)');
    if (onBack) onBack();
  };

  return (
    <form style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', padding: 32, width: 400, maxWidth: '95vw', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: 18 }} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Crear Usuario</h2>
      <label>Nombre<input name="name" value={form.name} onChange={handleChange} required style={{ marginTop: 4 }}/></label>
      <label>Apellido<input name="lastName" value={form.lastName} onChange={handleChange} required style={{ marginTop: 4 }}/></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required style={{ marginTop: 4 }}/></label>
      <label>Contraseña<input name="password" type="password" value={form.password} onChange={handleChange} required style={{ marginTop: 4 }}/></label>
      <label>Rol
        <select name="role" value={form.role} onChange={handleChange} style={{ marginTop: 4 }}>
          <option value="USER">Usuario</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </label>
      <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center' }}>
        <button type="submit" style={{ background: '#22223b', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }}>Crear</button>
        <button type="button" style={{ background: '#bdbdbd', color: '#22223b', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }} onClick={onBack}>Regresar</button>
      </div>
    </form>
  );
}; 