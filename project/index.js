const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer=require('multer')
const validationRoute = require('./routes/validationRoute');
const app = express();

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load the static files
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection established!!!"))
  .catch(err => console.log("MongoDB Error!!!", err));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the application!');
});

// Routes
app.use('/', validationRoute);

// Start the server
app.listen(3000, () => {
    console.log('App listening on port 3000!')
});
