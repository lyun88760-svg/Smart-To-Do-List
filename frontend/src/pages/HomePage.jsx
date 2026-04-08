import { useState, useCallback } from 'react';
import { useTask } from '../context/TaskContext';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import StatsPanel from '../components/StatsPanel';
import NotificationBell from '../components/NotificationBell';

export default function HomePage() {
  const { tasks, loading, fetchTasks } = useTask();
  const [filters, setFilters] = useState({ status: '', tag: '', priority: '' });
  const [search, setSearch] = useState('');

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchTasks({ ...newFilters, search });
  }, [fetchTasks, search]);

  const handleSearch = useCallback((searchTerm) => {
    setSearch(searchTerm);
    fetchTasks({ ...filters, search: searchTerm });
  }, [fetchTasks, filters]);

  return (
    <>
      <section className="task-section">
        <TaskForm onSubmitSuccess={() => fetchTasks(filters)} />
        <SearchBar onSearch={handleSearch} />
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
        <TaskList tasks={tasks} loading={loading} />
      </section>

      <aside className="sidebar">
        <NotificationBell />
        <StatsPanel />
      </aside>
    </>
  );
}
