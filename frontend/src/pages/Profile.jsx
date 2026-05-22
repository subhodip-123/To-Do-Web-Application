import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/auth.service';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, avatar: form.avatar };
      if (form.password) payload.password = form.password;
      const data = await authService.updateProfile(payload);
      updateUser(data);
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Profile</h1>
      <p className="text-sm text-slate-500 mb-6">Manage your account details.</p>
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-semibold">{user?.name}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={change}
              className="input"
            />
          </div>
          <div>
            <label className="label">Avatar URL</label>
            <input
              name="avatar"
              value={form.avatar}
              onChange={change}
              className="input"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={change}
              className="input"
              placeholder="Leave blank to keep current"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
