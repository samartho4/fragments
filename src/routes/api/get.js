// src/routes/api/get.js

const { createSuccessResponse } = require('../../response'); // Import the function

/**
 * Get a list of fragments for the current user
 */
module.exports = (req, res) => {
  // TODO: Replace this placeholder with actual logic
  const fragments = []; // Placeholder for fragments data
  res.status(200).json(createSuccessResponse({ fragments })); // Use createSuccessResponse
};