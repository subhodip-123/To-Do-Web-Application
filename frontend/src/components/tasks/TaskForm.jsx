import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const empty = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'general',
  dueDate: '',
};

export default function TaskForm({ initial, onSubmit, submitLabel = 'Save' }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        description: initial.description || '',
        priority: initial.priority || 'medium',
        category: initial.category || 'general',
        dueDate: initial.dueDate
          ? new Date(initial.dueDate).toISOString().slice(0, 10)
          : '',
      });
    }
  }, [initial]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.dueDate) payload.dueDate = null;
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={change}
          className="input"
          placeholder="What needs to be done?"
        />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={change}
          rows="3"
          className="input resize-none"
          placeholder="Add more detail (optional)"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="label">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={change}
            className="input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="label">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={change}
            className="input"
            placeholder="e.g. work, personal"
          />
        </div>
        <div>
          <label className="label">Due date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={change}
            className="input"
          />
        </div>
      </div>
      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
