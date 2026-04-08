import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [notifications, setNotifications] = useState([]);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.order) params.append('order', filters.order);

      const res = await api(`/tasks?${params.toString()}`);
      setTasks(res);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api('/stats');
      setStats(res);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api('/notifications');
      setNotifications(res);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, []);

  const createTask = useCallback(async (task) => {
    const res = await api('/tasks', { method: 'POST', body: task });
    setTasks(prev => [res, ...prev]);
    fetchStats();
    return res;
  }, [fetchStats]);

  const updateTask = useCallback(async (id, task) => {
    const res = await api(`/tasks/${id}`, { method: 'PUT', body: task });
    setTasks(prev => prev.map(t => t.id === id ? res : t));
    return res;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await api(`/tasks/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => t.id !== id));
    fetchStats();
  }, [fetchStats]);

  const toggleComplete = useCallback(async (id) => {
    const res = await api(`/tasks/${id}/complete`, { method: 'PATCH' });
    setTasks(prev => prev.map(t => t.id === id ? res : t));
    fetchStats();
    return res;
  }, [fetchStats]);

  const markNotificationRead = useCallback(async (id) => {
    await api(`/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await api('/notifications/read-all', { method: 'PATCH' });
    setNotifications([]);
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks, fetchStats, fetchNotifications]);

  return (
    <TaskContext.Provider value={{
      tasks, loading, stats, notifications,
      fetchTasks, fetchStats, fetchNotifications,
      createTask, updateTask, deleteTask, toggleComplete,
      markNotificationRead, markAllNotificationsRead
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  return useContext(TaskContext);
}
