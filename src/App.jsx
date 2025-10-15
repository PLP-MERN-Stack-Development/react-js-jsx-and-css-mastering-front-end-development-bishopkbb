import React, { useState, useEffect, useContext, createContext } from 'react';

// Custom Hook: useLocalStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Theme Context
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Button Component
const Button = ({ children, variant = 'primary', onClick, className = '', disabled, ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white',
    secondary: 'bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl border-2 border-amber-200 dark:border-amber-800 ${className}`}>
      {title && (
        <h3 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-800 to-orange-600 dark:from-amber-400 dark:to-orange-400">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <nav className="bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 dark:from-stone-950 dark:via-amber-950 dark:to-stone-950 shadow-2xl border-b-4 border-orange-600 dark:border-orange-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">R</span>
              </div>
              <span className="text-white text-3xl font-bold tracking-tight">React Premium</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                activeTab === 'tasks'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                  : 'text-orange-100 hover:bg-orange-700/50 hover:scale-105'
              }`}
            >
              Task Manager
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                activeTab === 'api'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                  : 'text-orange-100 hover:bg-orange-700/50 hover:scale-105'
              }`}
            >
              API Data
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            aria-label="Toggle theme"
          >
            <span className="text-2xl">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-amber-900 via-orange-900 to-amber-900 dark:from-stone-950 dark:via-amber-950 dark:to-stone-950 text-white mt-auto border-t-4 border-orange-600 dark:border-orange-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-2xl font-bold mb-4 text-orange-300">About</h4>
            <p className="text-orange-100">React Week 3 Assignment - Premium Task Manager</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-4 text-orange-300">Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-orange-100 hover:text-orange-300 transition-colors duration-300 text-lg">Documentation</a></li>
              <li><a href="#" className="text-orange-100 hover:text-orange-300 transition-colors duration-300 text-lg">GitHub</a></li>
              <li><a href="#" className="text-orange-100 hover:text-orange-300 transition-colors duration-300 text-lg">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-2xl font-bold mb-4 text-orange-300">Contact</h4>
            <p className="text-orange-100 text-lg">Email: ajibade_tosin@yahoo.com</p>
          </div>
        </div>
        <div className="border-t-2 border-orange-700 mt-10 pt-8 text-center">
          <p className="text-orange-200 text-lg">&copy; 2025 React Week 3 MERN Assignment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// TaskManager Component
const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <Card title="Task Manager" className="mb-8">
      <div className="space-y-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-6 py-4 border-2 border-amber-300 dark:border-amber-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500 dark:bg-amber-900 dark:text-white text-lg shadow-inner transition-all duration-300"
          />
          <Button onClick={addTask}>Add Task</Button>
        </div>

        <div className="flex gap-3 flex-wrap">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-3 rounded-xl capitalize transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl ${
                filter === f
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white scale-105'
                  : 'bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-800 dark:to-orange-800 text-amber-900 dark:text-orange-100 hover:scale-105'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-amber-700 dark:text-amber-400 text-center py-12 text-xl font-semibold">No tasks found</p>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-xl hover:shadow-lg transition-all duration-300 border-2 border-amber-200 dark:border-amber-800"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-6 h-6 rounded-lg cursor-pointer accent-orange-600"
                />
                <span className={`flex-1 text-lg ${task.completed ? 'line-through text-amber-600 dark:text-amber-500' : 'text-amber-900 dark:text-orange-100 font-medium'}`}>
                  {task.text}
                </span>
                <Button variant="danger" onClick={() => deleteTask(task.id)} className="py-2 px-5 text-base">
                  Delete
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="pt-6 border-t-2 border-amber-300 dark:border-amber-700">
          <p className="text-lg text-amber-800 dark:text-amber-400 font-semibold">
            Total: {tasks.length} | Active: {tasks.filter(t => !t.completed).length} | Completed: {tasks.filter(t => t.completed).length}
          </p>
        </div>
      </div>
    </Card>
  );
};

// API Data Component
const APIData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 4;
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (loading) {
    return (
      <Card title="API Data - Users">
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-orange-600"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-600 font-bold text-lg">
              Loading...
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="API Data - Users">
        <div className="text-red-700 dark:text-red-400 text-center py-12">
          <p className="text-2xl font-bold mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-6">Retry</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="API Data - Users" className="mb-8">
      <div className="space-y-6">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search users by name or email..."
          className="w-full px-6 py-4 border-2 border-amber-300 dark:border-amber-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500 dark:bg-amber-900 dark:text-white text-lg shadow-inner transition-all duration-300"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedUsers.map(user => (
            <div key={user.id} className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 rounded-xl hover:shadow-xl transition-all duration-300 border-2 border-amber-200 dark:border-amber-800 hover:scale-105">
              <h4 className="font-bold text-2xl text-amber-900 dark:text-orange-100 mb-2">{user.name}</h4>
              <p className="text-base text-amber-700 dark:text-orange-200 mb-1">{user.email}</p>
              <p className="text-base text-amber-600 dark:text-orange-300 mb-2">{user.phone}</p>
              <p className="text-sm text-amber-600 dark:text-orange-400 mt-3 font-medium">{user.address.city}, {user.address.street}</p>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Previous
            </Button>
            <span className="px-6 py-3 text-amber-900 dark:text-orange-100 font-bold text-lg bg-amber-200 dark:bg-amber-800 rounded-xl shadow-lg">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

// Main App Component
const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-stone-950 dark:via-amber-950 dark:to-stone-900 transition-all duration-500">
        <Navbar />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-orange-600 to-amber-800 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400 mb-4 drop-shadow-lg">
              React Premium Task Manager
            </h1>
            <p className="text-xl text-amber-700 dark:text-orange-300 font-medium">
              Your Productivity Wingman.
            </p>
          </div>

          <TaskManager />
          <APIData />
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;