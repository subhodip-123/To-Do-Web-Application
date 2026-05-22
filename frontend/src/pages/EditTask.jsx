import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskService } from '../services/task.service';
import TaskForm from '../components/tasks/TaskForm.jsx';
import Spinner from '../components/common/Spinner.jsx';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reuse list endpoint to find the task by paging is suboptimal; fetch via dedicated update fetch:
    taskService
      .list({ limit: 1000 })
      .then((data) => {
        const found = data.tasks.find((t) => t._id === id);
        if (!found) {
          toast.error('Task not found');
          navigate('/tasks');
          return;
        }
        setTask(found);
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      await taskService.update(id, data);
      toast.success('Task updated');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  if (loading) return <Spinner size="lg" />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Edit task</h1>
      <p className="text-sm text-slate-500 mb-6">Update the details below.</p>
      <div className="card p-6">
        <TaskForm initial={task} onSubmit={handleSubmit} submitLabel="Save changes" />
      </div>
    </div>
  );
}
