import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlineArrowDownTray,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

import { taskService } from '../services/task.service';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext.jsx';
import TaskCard from '../components/tasks/TaskCard.jsx';
import TaskFilters from '../components/tasks/TaskFilters.jsx';
import Pagination from '../components/tasks/Pagination.jsx';
import { TaskSkeleton } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import useDebounce from '../hooks/useDebounce';
import { exportToCSV, exportToPDF } from '../utils/exportTasks';

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sortBy: 'createdAt',
    page: 1,
    limit: 9,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.list({
        ...filters,
        search: debouncedSearch,
      });
      setTasks(data.tasks);
      setPages(data.pages);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.sortBy, filters.page, filters.limit, debouncedSearch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Socket.io live updates
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    const onCreate = () => fetchTasks();
    const onUpdate = () => fetchTasks();
    const onDelete = () => fetchTasks();
    socket.on('task:created', onCreate);
    socket.on('task:updated', onUpdate);
    socket.on('task:deleted', onDelete);
    return () => {
      socket.off('task:created', onCreate);
      socket.off('task:updated', onUpdate);
      socket.off('task:deleted', onDelete);
    };
  }, [user, fetchTasks]);

  const handleToggle = async (task) => {
    try {
      const updated = await taskService.toggleStatus(task._id, !task.completed);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await taskService.remove(toDelete._id);
      toast.success('Task deleted');
      setTasks((prev) => prev.filter((t) => t._id !== toDelete._id));
    } catch {
      toast.error('Delete failed');
    } finally {
      setToDelete(null);
    }
  };

  // Simple HTML5 drag & drop reordering
  const onDragStart = (i) => setDragIndex(i);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (i) => {
    if (dragIndex === null || dragIndex === i) return;
    const reordered = [...tasks];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(i, 0, moved);
    setTasks(reordered);
    setDragIndex(null);
    try {
      await taskService.reorder(reordered.map((t, idx) => ({ _id: t._id, order: idx })));
    } catch {
      toast.error('Failed to save order');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">All tasks</h1>
          <p className="text-sm text-slate-500">Manage everything in one place.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => exportToCSV(tasks)}
            className="btn-secondary"
            disabled={!tasks.length}
          >
            <HiOutlineArrowDownTray className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={() => exportToPDF(tasks)}
            className="btn-secondary"
            disabled={!tasks.length}
          >
            <HiOutlineDocumentText className="w-4 h-4" /> PDF
          </button>
          <Link to="/tasks/new" className="btn-primary">
            <HiOutlinePlus className="w-5 h-5" /> New
          </Link>
        </div>
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try changing filters or create a new task."
          action={
            <Link to="/tasks/new" className="btn-primary">
              <HiOutlinePlus className="w-4 h-4" /> Create task
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, i) => (
            <div
              key={task._id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(i)}
              className={dragIndex === i ? 'opacity-50' : ''}
            >
              <TaskCard
                task={task}
                onToggle={handleToggle}
                onDelete={(t) => setToDelete(t)}
              />
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={filters.page}
        pages={pages}
        onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this task?"
        description={`"${toDelete?.title}" will be permanently removed.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
