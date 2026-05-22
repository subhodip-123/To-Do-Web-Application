import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBars3,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        <button className="lg:hidden p-2" onClick={onMenuClick}>
          <HiOutlineBars3 className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold hidden md:block">
          Welcome back, {user?.name?.split(' ')[0] || 'there'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="btn-secondary !p-2"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <HiOutlineSun className="w-5 h-5" />
            ) : (
              <HiOutlineMoon className="w-5 h-5" />
            )}
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
            <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-sm font-medium">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="btn-secondary !p-2" title="Logout">
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
