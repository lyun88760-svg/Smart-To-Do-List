import { Router } from 'express';
import { TaskModel } from '../models/task.js';
import { NotificationModel } from '../models/notification.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { status, tag, search, sort, order } = req.query;
    const tasks = TaskModel.getAll({ status, tag, search, sort, order });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const task = TaskModel.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', (req, res) => {
  try {
    const existing = TaskModel.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = TaskModel.update(req.params.id, req.body);
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const existing = TaskModel.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }
    NotificationModel.deleteByTaskId(req.params.id);
    TaskModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/complete', (req, res) => {
  try {
    const task = TaskModel.toggleComplete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;