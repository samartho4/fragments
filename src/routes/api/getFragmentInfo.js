// src/routes/api/getFragmentInfo.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * GET /fragments/:id/info
 *
 * Return fragment metadata for the specified id
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug(`GET /fragments/${id}/info (user: ${req.user})`);
  
  try {
    // Get the fragment metadata for this user
    const fragment = await Fragment.byId(req.user, id);
    
    // Return the fragment metadata as JSON
    res.status(200).json(
      createSuccessResponse({
        fragment: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size
        }
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error getting fragment info');
    
    if (err.message === 'Fragment not found') {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    return res.status(500).json(createErrorResponse(500, 'Server error'));
  }
};