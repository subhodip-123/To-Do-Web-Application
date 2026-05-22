import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Sign in</h2>
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
          placeholder="Your password"
          autoComplete="current-password"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-sm text-center text-slate-500">
        New here?{' '}
        <Link to="/register" className="text-brand-600 font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
