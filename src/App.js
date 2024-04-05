import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false); // Initialize to false
  const [showLogin, setShowLogin] = useState(false); // Initialize to false

  useEffect(() => {
    fetchTodos();
    checkAuthentication();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const checkAuthentication = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/check`);
      if (response.status === 200) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setAuthenticated(false);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      if (response.status === 200) {
        setAuthenticated(true);
      } else {
        console.error('Error logging in:', response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignup = async (userData) => {
    try {
      console.log('Signup form submitted with data:', userData);
      await axios.post(`${API_BASE_URL}/signup`, userData);
      setShowSignup(false); // Hide signup form after successful signup
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`);
      setAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAddTodo = async (newTodo) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, newTodo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleUpdateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updatedTodo);
      const updatedTodos = todos.map(todo => (todo.id === id ? response.data : todo));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <div className="App" align-items="center">
      <h1>Todo App</h1>
      {authenticated ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <TodoForm onSubmit={handleAddTodo} />
          <TodoList todos={todos} onDelete={handleDeleteTodo} onUpdate={handleUpdateTodo} />
        </>
      ) : (
        <div>
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowSignup(true)}>Sign Up</button>
          {showSignup && <SignupForm onSignup={handleSignup} />}
          {showLogin && <LoginForm onLogin={handleLogin} />}
        </div>
      )}
    </div>
  );
}

export default App;


