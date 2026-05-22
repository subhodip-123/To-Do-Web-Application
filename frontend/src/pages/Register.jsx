import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Create your account</h2>
      <div>
        <label className="label">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={change}
          className="input"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={change}
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>
      <div>
        <label className="label">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          className="input"
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Creating...' : 'Create account'}
      </button>
      <p className="text-sm text-center text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
