// server.js

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
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
