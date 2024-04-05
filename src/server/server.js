const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample data for user accounts
let users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Sample data for todos
let todos = [
  { id: 1, title: 'Task 1', description: 'Description for Task 1', status: false },
  { id: 2, title: 'Task 2', description: 'Description for Task 2', status: true }
];

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// POST /api/auth/check - Check if the user is authenticated
app.post('/api/auth/check', (req, res) => {
  const { username, password } = req.body;
  // Find the user by username and password
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.status(200).json({ isAuthenticated: true, user });
  } else {
    res.status(401).json({ isAuthenticated: false, message: 'Invalid credentials' });
  }
});

// POST /api/login - User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Validate user credentials
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.status(200).json({ message: 'Login successful', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// POST /api/signup - Create a new user account
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;
  // Create a new user object with provided data
  const newUser = { id: users.length + 1, username, email, password };
  // Add the new user to the users array
  users.push(newUser);
  // Respond with a success message
  res.status(201).json({ message: 'User account created successfully', user: newUser });
});

// POST /api/logout - Log out the user
app.post('/api/logout', (req, res) => {
  // Here, you might clear any session or token associated with the user's authentication
  // For example, if using session-based authentication:
  // req.session.destroy(); // Destroy the session
  res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  // Return the todos array
  res.status(200).json({ todos });
});

// POST /api/todos - Create a new todo
app.post('/api/todos', (req, res) => {
  const { title, description } = req.body;
  // Create a new todo object
  const newTodo = { id: todos.length + 1, title, description, status: false };
  // Add the new todo to the todos array
  todos.push(newTodo);
  // Respond with a success message
  res.status(201).json({ message: 'Todo added successfully', todo: newTodo });
});

// PUT /api/todos/:id - Update a todo
app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // Find the todo in the todos array by id
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
  if (todoIndex !== -1) {
    // Update the status of the todo
    todos[todoIndex].status = status;
    // Respond with a success message
    res.status(200).json({ message: 'Todo updated successfully', todo: todos[todoIndex] });
  } else {
    // Respond with an error message if todo is not found
    res.status(404).json({ message: 'Todo not found' });
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  // Find the todo in the todos array by id
  const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
  if (todoIndex !== -1) {
    // Remove the todo from the todos array
    todos.splice(todoIndex, 1);
    // Respond with a success message
    res.status(200).json({ message: 'Todo deleted successfully' });
  } else {
    // Respond with an error message if todo is not found
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
