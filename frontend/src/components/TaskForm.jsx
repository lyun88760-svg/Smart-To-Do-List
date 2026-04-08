import { useState } from 'react';
import { useTask } from '../context/TaskContext';

const DEFAULT_TAGS = ['学习', '工作', '生活'];

export default function TaskForm({ onSubmitSuccess }) {
  const { createTask } = useTask();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: []
  });
  const [showTags, setShowTags] = useState(false);
  const [customTag, setCustomTag] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    await createTask(form);
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', tags: [] });
    onSubmitSuccess?.();
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !form.tags.includes(customTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()]
      }));
      setCustomTag('');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="form-input"
        placeholder="添加新任务..."
        value={form.title}
        onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
      />

      <textarea
        className="form-textarea"
        placeholder="任务描述（可选）"
        value={form.description}
        onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
      />

      <div className="form-row">
        <select
          className="form-select"
          value={form.priority}
          onChange={e => setForm(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="high">高优先级</option>
          <option value="medium">中优先级</option>
          <option value="low">低优先级</option>
        </select>

        <input
          type="datetime-local"
          className="form-input"
          value={form.dueDate}
          onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
        />
      </div>

      <div className="form-tags">
        <button type="button" className="tags-toggle" onClick={() => setShowTags(!showTags)}>
          {form.tags.length > 0 ? `标签 (${form.tags.length})` : '添加标签'}
        </button>
        {showTags && (
          <div className="tags-panel">
            {DEFAULT_TAGS.map(tag => (
              <label key={tag} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={form.tags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                {tag}
              </label>
            ))}
            <div className="custom-tag">
              <input
                type="text"
                value={customTag}
                onChange={e => setCustomTag(e.target.value)}
                placeholder="自定义标签"
              />
              <button type="button" onClick={addCustomTag}>添加</button>
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="btn-primary">添加任务</button>
    </form>
  );
}
