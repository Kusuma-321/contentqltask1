import React from 'react';
import './TodoList.css';
import axios from 'axios';

const TodoList = ({ todos, onDelete, onUpdate }) => {
  const handleToggleComplete = async (id, status) => {
    try {
      const updatedTodo = { status: !status };
      await axios.put(`http://localhost:5000/api/todos/${id}`, updatedTodo);
      onUpdate(id, updatedTodo);
    } catch (error) {
      console.error('Error toggling todo complete:', error);
    }
  };

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className={`todo-item ${todo.status ? 'completed' : ''}`}>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <div>
            <button onClick={() => handleToggleComplete(todo.id, todo.status)}>
              {todo.status ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => onDelete(todo.id)} className="delete-button">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;


