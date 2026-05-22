import { NavLink } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineClipboardDocumentList,
  HiOutlinePlus,
  HiOutlineUserCircle,
  HiOutlineXMark,
} from 'react-icons/hi2';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/tasks', label: 'All Tasks', icon: HiOutlineClipboardDocumentList },
  { to: '/tasks/new', label: 'New Task', icon: HiOutlinePlus },
  { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
              T
            </div>
            <span className="font-semibold text-lg">Tasker</span>
          </div>
          <button className="lg:hidden p-1" onClick={onClose}>
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
