const express = require('express');
const morgan = require('morgan');

const routes = require('./routes/route.js');

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging Middleware with Morgan
app.use(morgan('tiny'));

// Routes
app.use('/', routes)

module.exports = app;
