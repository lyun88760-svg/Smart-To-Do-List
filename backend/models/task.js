import { getDb, saveDb } from '../db/init.js';

export const TaskModel = {
  getAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ` AND status = '${filters.status}'`;
    }

    if (filters.tag) {
      query += ` AND tags LIKE '%${filters.tag}%'`;
    }

    if (filters.priority) {
      query += ` AND priority = '${filters.priority}'`;
    }

    if (filters.search) {
      query += ` AND (title LIKE '%${filters.search}%' OR description LIKE '%${filters.search}%')`;
    }

    if (filters.sort) {
      const sortMap = {
        priority: "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END",
        dueDate: 'dueDate',
        createdAt: 'createdAt'
      };
      query += ` ORDER BY ${sortMap[filters.sort] || 'createdAt'} ${filters.order === 'desc' ? 'DESC' : 'ASC'}`;
    } else {
      query += ' ORDER BY createdAt DESC';
    }

    const result = db.exec(query);
    if (!result[0]) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  },

  getById(id) {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    stmt.bind([id]);
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  },

  create(task) {
    const db = getDb();
    const now = new Date().toISOString();
    db.run(`
      INSERT INTO tasks (title, description, priority, dueDate, tags, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      task.title,
      task.description || '',
      task.priority || 'medium',
      task.dueDate || null,
      JSON.stringify(task.tags || []),
      now,
      now
    ]);
    const lastId = db.exec('SELECT last_insert_rowid()')[0].values[0][0];
    saveDb();
    return this.getById(lastId);
  },

  update(id, task) {
    const db = getDb();
    const now = new Date().toISOString();
    db.run(`
      UPDATE tasks
      SET title = ?, description = ?, priority = ?, dueDate = ?, tags = ?, updatedAt = ?
      WHERE id = ?
    `, [
      task.title,
      task.description || '',
      task.priority || 'medium',
      task.dueDate || null,
      JSON.stringify(task.tags || []),
      now,
      id
    ]);
    saveDb();
    return this.getById(id);
  },

  delete(id) {
    const db = getDb();
    db.run('DELETE FROM tasks WHERE id = ?', [id]);
    saveDb();
  },

  toggleComplete(id) {
    const db = getDb();
    const task = this.getById(id);
    if (!task) return null;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;
    const now = new Date().toISOString();
    db.run(`
      UPDATE tasks SET status = ?, completedAt = ?, updatedAt = ? WHERE id = ?
    `, [newStatus, completedAt, now, id]);
    saveDb();
    return this.getById(id);
  }
};