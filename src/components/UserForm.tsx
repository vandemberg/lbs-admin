import { useState } from 'react';
import User from '@/models/User';

interface UserFormProps {
  user: User;
  handleSubmit: (user: User) => void;
}

export default function UserForm({ user, handleSubmit }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '',
    password_confirmation: '',
    role: user.role || 'user',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      alert('As senhas não coincidem!');
      return;
    }
    handleSubmit({
      ...user,
      ...formData,
    });
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <div>
        <label>Nome:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </div>
      <div>
        <label>Confirmar Senha:</label>
        <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required />
      </div>
      <div>
        <label>Tipo de Usuário:</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="student">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <button type="submit">Criar Usuário</button>
    </form>
  );
}
