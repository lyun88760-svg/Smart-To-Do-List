import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
