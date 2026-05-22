const asyncHandler = require('express-async-handler');
const { Op, fn, col } = require('sequelize');
const Task = require('../models/Task');

const emit = (req, event, payload) => {
  const io = req.app.get('io');
  if (io && req.user) io.to(`user:${req.user.id}`).emit(event, payload);
};

// @desc   Get tasks (with search, filter, pagination)
// @route  GET /api/tasks
// @access Private
exports.getTasks = asyncHandler(async (req, res) => {
  const {
    search = '',
    status,
    priority,
    category,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const where = { userId: req.user.id };

  if (status === 'completed') where.completed = true;
  if (status === 'pending') where.completed = false;
  if (priority) where.priority = priority;
  if (category) where.category = category;
  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { category: { [Op.like]: `%${search}%` } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;
  const sortDir = order === 'asc' ? 'ASC' : 'DESC';

  const validSortFields = ['createdAt', 'updatedAt', 'title', 'priority', 'dueDate', 'order'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

  const [tasks, total] = await Promise.all([
    Task.findAll({ where, order: [[orderField, sortDir]], offset, limit: limitNum }),
    Task.count({ where }),
  ]);

  res.json({
    tasks,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    total,
  });
});

// @desc   Get task stats for dashboard
// @route  GET /api/tasks/stats
// @access Private
exports.getStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const [total, completed, priorityGroups, recent, todaysTasks] = await Promise.all([
    Task.count({ where: { userId } }),
    Task.count({ where: { userId, completed: true } }),
    Task.findAll({
      where: { userId },
      attributes: ['priority', [fn('COUNT', col('id')), 'count']],
      group: ['priority'],
      raw: true,
    }),
    Task.findAll({ where: { userId }, order: [['updatedAt', 'DESC']], limit: 5 }),
    Task.findAll({
      where: { userId, dueDate: { [Op.gte]: startOfDay, [Op.lte]: endOfDay } },
      order: [['dueDate', 'ASC']],
    }),
  ]);

  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const byPriority = priorityGroups.map((g) => ({ _id: g.priority, count: parseInt(g.count) }));

  res.json({ total, completed, pending, progress, byPriority, recent, todaysTasks });
});

// @desc   Create task
// @route  POST /api/tasks
// @access Private
exports.createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({ ...req.body, userId: req.user.id });
  emit(req, 'task:created', task);
  res.status(201).json(task);
});

// @desc   Update task
// @route  PUT /api/tasks/:id
// @access Private
exports.updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.update(req.body);
  emit(req, 'task:updated', task);
  res.json(task);
});

// @desc   Delete task
// @route  DELETE /api/tasks/:id
// @access Private
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  await task.destroy();
  emit(req, 'task:deleted', { _id: req.params.id });
  res.json({ message: 'Task deleted', _id: req.params.id });
});

// @desc   Toggle / set status
// @route  PATCH /api/tasks/:id/status
// @access Private
exports.toggleStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  const completed =
    typeof req.body.completed === 'boolean' ? req.body.completed : !task.completed;
  await task.update({ completed });
  emit(req, 'task:updated', task);
  res.json(task);
});

// @desc   Reorder tasks (for drag and drop)
// @route  PATCH /api/tasks/reorder
// @access Private
exports.reorderTasks = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ _id, order }] or [{ id, order }]
  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error('items array required');
  }
  await Promise.all(
    items.map((it) =>
      Task.update({ order: it.order }, { where: { id: it._id || it.id, userId: req.user.id } })
    )
  );
  res.json({ message: 'Order updated' });
});
