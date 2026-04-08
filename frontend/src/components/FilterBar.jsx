import { useState, useEffect } from 'react';

export default function FilterBar({ filters, onFilterChange }) {
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    fetch('/api/tags').then(r => r.json()).then(setAvailableTags).catch(() => {});
  }, []);

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>状态：</label>
        <select
          value={filters.status || ''}
          onChange={e => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">全部</option>
          <option value="pending">待完成</option>
          <option value="completed">已完成</option>
        </select>
      </div>

      <div className="filter-group">
        <label>标签：</label>
        <select
          value={filters.tag || ''}
          onChange={e => onFilterChange({ ...filters, tag: e.target.value })}
        >
          <option value="">全部</option>
          {availableTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>优先级：</label>
        <select
          value={filters.priority || ''}
          onChange={e => onFilterChange({ ...filters, priority: e.target.value })}
        >
          <option value="">全部</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      <div className="filter-group">
        <label>排序：</label>
        <select
          value={`${filters.sort || 'createdAt'}-${filters.order || 'desc'}`}
          onChange={e => {
            const [sort, order] = e.target.value.split('-');
            onFilterChange({ ...filters, sort, order });
          }}
        >
          <option value="createdAt-desc">最新优先</option>
          <option value="createdAt-asc">最旧优先</option>
          <option value="priority-asc">优先级高→低</option>
          <option value="dueDate-asc">截止时间近→远</option>
        </select>
      </div>
    </div>
  );
}
