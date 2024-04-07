const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URI
const MONGODB_URI ='mongodb+srv://Kusuma1:Kusuma@cluster0.mvpgnfs.mongodb.net/';
// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Define Todo Schema and Model
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: Boolean
});
const Todo = mongoose.model('Todo', todoSchema);

// Signup route to create a new user
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User account created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user account' });
  }
});

// Login route to authenticate user
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Failed to authenticate user' });
  }
});
app.post('/api/logout', (req, res) => {
  // Here, you might clear any session or token associated with the user's authentication
  // For example, if using session-based authentication:
  // req.session.destroy(); // Destroy the session
  res.status(200).json({ message: 'Logged out successfully' });
});
// Route to fetch all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// Route to create a new todo
app.post('/api/todos', async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new Todo({ title, description, status: false });
    await newTodo.save();
    res.status(201).json({ message: 'Todo added successfully', todo: newTodo });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Failed to add todo' });
  }
});

// Route to update a todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const todo = await Todo.findByIdAndUpdate(id, { status }, { new: true });
    if (todo) {
      res.status(200).json({ message: 'Todo updated successfully', todo });
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
   
    // Check if the ID is in the correct format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }
    
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (deletedTodo) {
      res.status(200).json({ message: 'Todo deleted successfully' });
    } else {
      res.status(404).json({ message: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
