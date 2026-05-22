import api from './api';

export const taskService = {
  list: (params = {}) => api.get('/tasks', { params }).then((r) => r.data),
  stats: () => api.get('/tasks/stats').then((r) => r.data),
  create: (data) => api.post('/tasks', data).then((r) => r.data),
  update: (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/tasks/${id}`).then((r) => r.data),
  toggleStatus: (id, completed) =>
    api.patch(`/tasks/${id}/status`, { completed }).then((r) => r.data),
  reorder: (items) =>
    api.patch('/tasks/reorder', { items }).then((r) => r.data),
};
