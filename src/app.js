const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

module.exports = app;