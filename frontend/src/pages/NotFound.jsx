import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="text-center">
        <p className="text-7xl font-bold text-brand-600">404</p>
        <h1 className="text-2xl font-semibold mt-2">Page not found</h1>
        <p className="text-slate-500 mt-1">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    </div>
  );
}
