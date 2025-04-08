// src/routes/api/delete.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * DELETE /fragments/:id
 *
 * Deletes the specified fragment from the database for the authenticated user.
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug(`DELETE /fragments/${id} (user: ${req.user})`);
  
  try {
    // First, check if the fragment exists
    const fragment = await Fragment.byId(req.user, id);

    if( !fragment ) {
        // If the fragment does not exist, return a 404 error
        logger.debug(`Fragment ${id} not found`);
        return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    // If we got here, the fragment exists. Delete it now
    await Fragment.delete(req.user, id);
    
    // Return a 200 with a success response
    res.status(200).json(
      createSuccessResponse({
        message: `Fragment ${id} deleted successfully`
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error deleting fragment');
    
    if (err.message === 'Fragment not found') {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    return res.status(500).json(createErrorResponse(500, 'Unable to delete fragment'));
  }
};