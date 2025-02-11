// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const { authenticate } = require('../../auth');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Import the get object

//const get = require('./get');

// Apply authentication middleware for all routes
router.use(authenticate()); // Apply middleware to all routes

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
// Other routes (POST, DELETE, etc.) will go here later on...
// POST /v1/fragments
// Creates a new fragment for the authenticated user
router.post('/fragments',require('./post'));
// Other routes (POST, DELETE, etc.) will g

module.exports = router;