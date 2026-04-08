import { useTask } from '../context/TaskContext';

const PRIORITY_CONFIG = {
  high: { label: '高', color: '#f44336' },
  medium: { label: '中', color: '#ff9800' },
  low: { label: '低', color: '#4caf50' }
};

export default function TaskItem({ task }) {
  const { toggleComplete, deleteTask } = useTask();

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const parseTags = (tagsStr) => {
    try {
      return JSON.parse(tagsStr || '[]');
    } catch {
      return [];
    }
  };

  return (
    <div className={`task-item ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={() => toggleComplete(task.id)}
        />
      </div>

      <div className="task-content">
        <div className="task-header">
          <span className="task-title">{task.title}</span>
          <span className="priority-badge" style={{ backgroundColor: priority.color }}>
            {priority.label}
          </span>
        </div>

        {task.description && <p className="task-desc">{task.description}</p>}

        <div className="task-meta">
          {task.dueDate && (
            <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? '已过期 ' : ''}{formatDate(task.dueDate)}
            </span>
          )}
          <div className="task-tags">
            {parseTags(task.tags).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button className="btn-delete" onClick={() => deleteTask(task.id)}>
          删除
        </button>
      </div>
    </div>
  );
}
