import axios from 'axios';

// Base URL for all API calls
// This points to our Express backend
const API_BASE_URL = 'http://localhost:5000';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL
});

// ==================== HELPER FUNCTION ====================
// Add JWT token to every request
// This runs before each API call
api.interceptors.request.use(
  (config) => {
    // Get token from browser localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==================== AUTH API CALLS ====================

// Signup - Create new user account
export const signup = (email, password) => {
  return api.post('/api/auth/signup', { email, password });
};

// Login - Get JWT token
export const login = (email, password) => {
  return api.post('/api/auth/login', { email, password });
};

// ==================== TODO API CALLS ====================

// Get all todos for logged-in user
export const getTodos = () => {
  return api.get('/api/todos');
};

// Get a single todo by ID
export const getTodoById = (id) => {
  return api.get(`/api/todos/${id}`);
};

// Create a new todo
export const createTodo = (title, description) => {
  return api.post('/api/todos', { title, description });
};

// Update a todo
export const updateTodo = (id, title, description, completed) => {
  return api.put(`/api/todos/${id}`, { title, description, completed });
};

// Delete a todo
export const deleteTodo = (id) => {
  return api.delete(`/api/todos/${id}`);
};

// ==================== HELPER FUNCTIONS ====================

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token from localStorage (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

export default api;