import { useTask } from '../context/TaskContext';

export default function StatsPanel() {
  const { stats } = useTask();

  return (
    <div className="stats-panel">
      <h3>任务统计</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">总任务</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">已完成</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.pending}</span>
          <span className="stat-label">待完成</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.completionRate}%</span>
          <span className="stat-label">完成率</span>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${stats.completionRate}%` }}
        />
      </div>
    </div>
  );
}
