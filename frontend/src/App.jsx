import HomePage from './pages/HomePage';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>Task Tracker</h1>
        <ThemeToggle />
      </header>
      <main className="main-content">
        <HomePage />
      </main>
    </div>
  );
}

export default App;
