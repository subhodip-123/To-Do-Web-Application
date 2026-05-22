import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthLayout() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-brand-50 via-white to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white text-xl font-bold mb-3">
            T
          </div>
          <h1 className="text-2xl font-bold">Tasker</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay focused. Get things done.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
