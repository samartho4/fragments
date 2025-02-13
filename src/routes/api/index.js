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
const rawBody = () =>
    express.raw({
      inflate: true,
      limit: '5mb',
      type: (req) => {
        const parsed = require('content-type').parse(req.headers['content-type']);
        // Check against supported types without parameters
        return require('../../model/fragment').Fragment.isSupportedType(parsed.type);
      },
    });
router.post('/fragments',rawBody(),require('./post'));
// Other routes (POST, DELETE, etc.) will g

module.exports = router;