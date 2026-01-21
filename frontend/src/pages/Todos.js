import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodos, createTodo, updateTodo, deleteTodo, removeToken } from '../services/api';
import '../styles/Todos.css';

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data.todos);
    } catch (err) {
      setError('Failed to load todos');
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);

    try {
      const response = await createTodo(title, description);
      const newTodo = {
        ...response.data.todo,
        priority,
        dueDate
      };
      setTodos([newTodo, ...todos]);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create todo');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTodo = async (id, newTitle, newDesc, completed) => {
    try {
      const response = await updateTodo(id, newTitle, newDesc, completed);
      setTodos(todos.map(t => t.id === id ? response.data.todo : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Filter and search logic
  let filteredTodos = todos;

  if (filter === 'active') {
    filteredTodos = filteredTodos.filter(t => !t.completed);
  } else if (filter === 'completed') {
    filteredTodos = filteredTodos.filter(t => t.completed);
  }

  if (searchTerm) {
    filteredTodos = filteredTodos.filter(t =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Statistics
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  return (
    <div className="todos-container">
      {/* Header */}
      <div className="todos-header">
        <div className="header-left">
          <h1>Task Manager</h1>
          <p className="header-subtitle">Organize your work with elegance</p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon total">📋</div>
          <div className="stat-content">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">✓</div>
          <div className="stat-content">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Create Todo Form */}
      <form className="todo-form" onSubmit={handleCreateTodo}>
        <h2 className="form-title">Create New Task</h2>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="priority-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              placeholder="Add more details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>

      {/* Search and Filter */}
      <div className="search-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Todos List */}
      <div className="todos-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-message">
              {searchTerm ? 'No tasks match your search' : 'No tasks yet. Create one!'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority || 'medium'}`}
            >
              <div className="todo-left">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleUpdateTodo(todo.id, todo.title, todo.description, !todo.completed)}
                  className="todo-checkbox"
                />
                <div className="priority-indicator"></div>
                <div className="todo-text">
                  <h3>{todo.title}</h3>
                  {todo.description && <p>{todo.description}</p>}
                  {todo.dueDate && <span className="due-date">📅 {todo.dueDate}</span>}
                </div>
              </div>

              <button
                className="btn-delete-todo"
                onClick={() => handleDeleteTodo(todo.id)}
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Todos;