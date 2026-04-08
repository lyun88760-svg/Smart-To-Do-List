import cron from 'node-cron';
import { getDb } from '../db/init.js';
import { NotificationModel } from '../models/notification.js';

export function startReminderService() {
  cron.schedule('* * * * *', () => {
    const db = getDb();
    if (!db) return;

    const now = new Date().toISOString();
    const stmt = db.prepare(`
      SELECT * FROM tasks
      WHERE status = 'pending'
      AND dueDate IS NOT NULL
      AND dueDate <= ?
    `);
    stmt.bind([now]);

    const tasks = [];
    while (stmt.step()) {
      tasks.push(stmt.getAsObject());
    }
    stmt.free();

    tasks.forEach(task => {
      NotificationModel.create({
        taskId: task.id,
        message: `任务 "${task.title}" 已到期`
      });
    });

    if (tasks.length > 0) {
      console.log(`[Reminder] Processed ${tasks.length} due tasks`);
    }
  });

  console.log('Reminder service started');
}