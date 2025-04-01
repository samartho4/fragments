// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const { authenticate } = require('../../auth');

// Create a router on which to mount our API endpoints
const router = express.Router();

// Apply authentication middleware for all routes
router.use(authenticate()); // Apply middleware to all routes

// Define route for GET /v1/fragments
router.get('/fragments', require('./get').getFragmentsList);

// Define route for POST /v1/fragments
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
router.post('/fragments', rawBody(), require('./post'));

// IMPORTANT - Order matters for route definitions!
// Routes with more specific patterns must come before less specific ones

// GET /v1/fragments/:id/info route must come before the generic ID route
router.get('/fragments/:id/info', require('./getFragmentInfo'));

// GET /v1/fragments/:id.:ext route for conversion
router.get('/fragments/:id.:ext', require('./getByIdExt'));

// GET /v1/fragments/:id route comes last
router.get('/fragments/:id', require('./getById'));

// DELETE /v1/fragments/:id route for deleting fragments
router.delete('/fragments/:id', require('./delete'));

module.exports = router;