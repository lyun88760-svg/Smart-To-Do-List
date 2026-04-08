import { getDb, saveDb } from '../db/init.js';

export const NotificationModel = {
  getUnread() {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT n.*, t.title as taskTitle
      FROM notifications n
      LEFT JOIN tasks t ON n.taskId = t.id
      WHERE n.read = 0
      ORDER BY n.createdAt DESC
    `);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  },

  create(notification) {
    const db = getDb();

    // Check if existing unread notification for same task
    const checkStmt = db.prepare('SELECT * FROM notifications WHERE taskId = ? AND read = 0');
    checkStmt.bind([notification.taskId]);
    let existing = null;
    if (checkStmt.step()) {
      existing = checkStmt.getAsObject();
    }
    checkStmt.free();
    if (existing) return existing;

    const now = new Date().toISOString();
    db.run(`
      INSERT INTO notifications (taskId, message, createdAt) VALUES (?, ?, ?)
    `, [notification.taskId, notification.message, now]);

    const lastId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    saveDb();

    const newStmt = db.prepare('SELECT * FROM notifications WHERE id = ?');
    newStmt.bind([lastId]);
    let result = null;
    if (newStmt.step()) {
      result = newStmt.getAsObject();
    }
    newStmt.free();
    return result;
  },

  markAsRead(id) {
    const db = getDb();
    db.run('UPDATE notifications SET read = 1 WHERE id = ?', [id]);
    saveDb();
  },

  markAllAsRead() {
    const db = getDb();
    db.run('UPDATE notifications SET read = 1 WHERE read = 0');
    saveDb();
  },

  deleteByTaskId(taskId) {
    const db = getDb();
    db.run('DELETE FROM notifications WHERE taskId = ?', [taskId]);
    saveDb();
  }
};