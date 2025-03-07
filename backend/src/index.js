const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const bookingRoutes = require('./routes/bookings');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Data paths
const dataPath = {
  users: path.join(__dirname, 'data', 'users.json'),
  hotels: path.join(__dirname, 'data', 'hotels.json'),
  bookings: path.join(__dirname, 'data', 'bookings.json')
};

// Middleware
app.use(cors());
app.use(express.json());

// Make data paths available to routes
app.use((req, res, next) => {
  req.dataPath = dataPath;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hotel Booking API' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
