const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer=require('multer')
const validationRoute = require('./routes/validationRoute');
const app = express();
const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Create a counter
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds.',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

register.registerMetric(httpRequestDurationMicroseconds);

app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});


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
