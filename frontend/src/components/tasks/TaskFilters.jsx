import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

export default function TaskFilters({ filters, setFilters }) {
  const update = (k, v) => setFilters((f) => ({ ...f, [k]: v, page: 1 }));

  return (
    <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="relative">
        <HiOutlineMagnifyingGlass className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
        <input
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          placeholder="Search tasks..."
          className="input pl-10"
        />
      </div>
      <select
        value={filters.status}
        onChange={(e) => update('status', e.target.value)}
        className="input"
      >
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={filters.priority}
        onChange={(e) => update('priority', e.target.value)}
        className="input"
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        value={filters.sortBy}
        onChange={(e) => update('sortBy', e.target.value)}
        className="input"
      >
        <option value="createdAt">Newest</option>
        <option value="dueDate">Due date</option>
        <option value="priority">Priority</option>
        <option value="title">Title</option>
      </select>
    </div>
  );
}
