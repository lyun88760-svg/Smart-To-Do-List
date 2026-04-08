import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading }) {
  if (loading) return <div className="loading">加载中...</div>;

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>暂无任务</p>
        <p>添加一个新任务开始吧！</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
