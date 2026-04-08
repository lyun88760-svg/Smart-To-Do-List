import { Router } from 'express';
import { getDb } from '../db/init.js';

const router = Router();

router.get('/stats', (req, res) => {
  try {
    const db = getDb();

    const totalResult = db.exec('SELECT COUNT(*) as count FROM tasks');
    const total = totalResult[0]?.values[0][0] || 0;

    const completedResult = db.exec("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'");
    const completed = completedResult[0]?.values[0][0] || 0;

    const pendingResult = db.exec("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending'");
    const pending = pendingResult[0]?.values[0][0] || 0;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      total,
      completed,
      pending,
      completionRate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tags', (req, res) => {
  try {
    const db = getDb();
    const result = db.exec('SELECT tags FROM tasks');
    const tagSet = new Set();

    if (result[0]) {
      result[0].values.forEach(row => {
        try {
          const tags = JSON.parse(row[0] || '[]');
          tags.forEach(tag => tagSet.add(tag));
        } catch (e) {}
      });
    }

    res.json(Array.from(tagSet));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;