// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Import the get object
const get = require('./get');

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', (req, res) => {
  res.status(200).json(get);
});

// Other routes (POST, DELETE, etc.) will go here later on...

module.exports = router;
