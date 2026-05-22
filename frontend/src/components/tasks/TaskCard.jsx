import { Link } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCalendar } from 'react-icons/hi2';
import { formatDate, isOverdue, isToday, priorityColor } from '../../utils/format';

export default function TaskCard({ task, onToggle, onDelete, dragHandleProps }) {
  return (
    <div className="card p-4 flex items-start gap-3 hover:shadow-md transition group">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task)}
        className="mt-1 w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
      />
      <div className="flex-1 min-w-0" {...(dragHandleProps || {})}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-medium truncate ${
              task.completed
                ? 'line-through text-slate-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <Link
              to={`/tasks/${task._id}/edit`}
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Edit"
            >
              <HiOutlinePencil className="w-4 h-4" />
            </Link>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600"
              title="Delete"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
        {task.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className={`badge ${priorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {task.category && (
            <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {task.category}
            </span>
          )}
          {task.dueDate && (
            <span
              className={`badge inline-flex items-center gap-1 ${
                isOverdue(task.dueDate) && !task.completed
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : isToday(task.dueDate)
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <HiOutlineCalendar className="w-3.5 h-3.5" />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
