// src/routes/index.js

const express = require('express');
const { createSuccessResponse } = require('../response'); // Import the function

// version and author from package.json
const { version, author } = require('../../package.json');

// Create a router that we can use to mount our API
const router = express.Router();
// Our authentication middleware
const { authenticate } = require('../auth');
const  createFragment  = require('./api/post'); // ✅ Import the function correctly

/**
 * Expose all of our API routes on /v1/* to include an API version.
 * Protect them all with middleware so you have to be authenticated
 * in order to access things.
 */
router.use(`/v1`, authenticate(), require('./api'));

/**
 * Define a simple health check route. If the server is running
 * we'll respond with a 200 OK.  If not, the server isn't healthy.
 */
router.get('/', (req, res) => {
  // Client's shouldn't cache this response (always request it fresh)
  res.setHeader('Cache-Control', 'no-cache');

  // Create a success response with the required data
  const data = {
    author,
    githubUrl: 'https://github.com/samartho4/fragments', // Update with your GitHub URL
    version,
  };
  res.status(200).json(createSuccessResponse(data)); // Use createSuccessResponse
});
// ✅ Middleware to parse raw body
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = require('content-type').parse(req);
      return require('../model/fragment').Fragment.isSupportedType(type);
    },
  });

  router.post('/v1/fragments', authenticate(), rawBody(), createFragment); // ✅ Use function reference



module.exports = router;






