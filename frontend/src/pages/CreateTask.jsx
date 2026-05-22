import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { taskService } from '../services/task.service';
import TaskForm from '../components/tasks/TaskForm.jsx';

export default function CreateTask() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await taskService.create(data);
      toast.success('Task created');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Create a task</h1>
      <p className="text-sm text-slate-500 mb-6">Add a new item to your list.</p>
      <div className="card p-6">
        <TaskForm onSubmit={handleSubmit} submitLabel="Create task" />
      </div>
    </div>
  );
}
