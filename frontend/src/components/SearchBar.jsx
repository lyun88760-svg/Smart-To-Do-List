import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="搜索任务..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </div>
  );
}
