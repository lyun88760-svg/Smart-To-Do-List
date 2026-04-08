import { Router } from 'express';
import { NotificationModel } from '../models/notification.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const notifications = NotificationModel.getUnread();
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', (req, res) => {
  try {
    NotificationModel.markAsRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/read-all', (req, res) => {
  try {
    NotificationModel.markAllAsRead();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;