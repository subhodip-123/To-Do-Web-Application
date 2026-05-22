import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlinePlus,
} from 'react-icons/hi2';
import { taskService } from '../services/task.service';
import StatCard from '../components/dashboard/StatCard.jsx';
import ProgressBar from '../components/dashboard/ProgressBar.jsx';
import PriorityChart from '../components/dashboard/PriorityChart.jsx';
import { TaskSkeleton } from '../components/common/Skeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDate } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taskService
      .stats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-slate-500">Your task overview at a glance.</p>
        </div>
        <Link to="/tasks/new" className="btn-primary">
          <HiOutlinePlus className="w-5 h-5" /> New task
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total tasks"
          value={stats.total}
          icon={HiOutlineClipboardDocumentList}
          color="brand"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={HiOutlineCheckCircle}
          color="green"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={HiOutlineClock}
          color="amber"
        />
        <StatCard
          label="Today's tasks"
          value={stats.todaysTasks?.length || 0}
          icon={HiOutlineFire}
          color="rose"
        />
      </div>

      {/* Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ProgressBar value={stats.progress} />
          <div className="card p-5">
            <h3 className="font-semibold mb-3">Today's tasks</h3>
            {stats.todaysTasks?.length ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {stats.todaysTasks.map((t) => (
                  <li key={t._id} className="py-3 flex items-center justify-between">
                    <div>
                      <p
                        className={`font-medium ${
                          t.completed ? 'line-through text-slate-400' : ''
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="text-xs text-slate-500">{t.category}</p>
                    </div>
                    <span className="text-xs text-slate-500">
                      {formatDate(t.dueDate)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Nothing due today"
                description="Enjoy a calm day or plan ahead."
              />
            )}
          </div>
        </div>
        <PriorityChart data={stats.byPriority} />
      </div>

      {/* Recent activity */}
      <div className="card p-5">
        <h3 className="font-semibold mb-3">Recent activity</h3>
        {stats.recent?.length ? (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {stats.recent.map((t) => (
              <li key={t._id} className="py-3 flex items-center justify-between">
                <span className="font-medium">{t.title}</span>
                <span className="text-xs text-slate-500">
                  Updated {formatDate(t.updatedAt)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
