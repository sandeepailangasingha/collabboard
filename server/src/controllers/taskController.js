import { TaskModel } from '../models/taskModel.js';

// @desc    Get all tasks with optional filtering
// @route   GET /api/tasks
export const getTasks = (req, res) => {
  const { status, priority, search } = req.query;
  const tasks = TaskModel.findAll({ status, priority, search });
  return res.json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
export const getTaskById = (req, res) => {
  const task = TaskModel.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json({ success: true, data: task });
};

// @desc    Create new task
// @route   POST /api/tasks
export const createTask = (req, res) => {
  const { title, description, status, priority, assignee, dueDate, tags } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Task title is required' });
  }

  const newTask = TaskModel.create({
    title: title.trim(),
    description,
    status,
    priority,
    assignee,
    dueDate,
    tags,
  });

  return res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask,
  });
};

// @desc    Update existing task
// @route   PUT /api/tasks/:id
export const updateTask = (req, res) => {
  const updatedTask = TaskModel.update(req.params.id, req.body);
  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask,
  });
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = (req, res) => {
  const success = TaskModel.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json({
    success: true,
    message: 'Task deleted successfully',
  });
};
