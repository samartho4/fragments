// src/routes/api/delete.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * DELETE /fragments/:id
 *
 * Deletes a fragment with the given id for the current user.
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug(`DELETE /fragments/${id} (user: ${req.user})`);
  
  try {
    // Check if the fragment exists first
    try {
      await Fragment.byId(req.user, id);
    } catch (err) {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    // Delete the fragment
    await Fragment.delete(req.user, id);
    
    // Return a success response
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.error({ err }, 'Error deleting fragment');
    res.status(500).json(createErrorResponse(500, 'Unable to delete fragment'));
  }
};