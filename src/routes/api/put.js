// src/routes/api/put.js
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
const logger = require('../../logger');
const { validateFragment } = require('../../utils/typeValidation');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * PUT /fragments/:id
 *
 * Updates an existing fragment for the current user
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  const { type } = contentType.parse(req);
  
  logger.debug(`PUT /fragments/${id} (user: ${req.user}, type: ${type})`);
  
  try {
    // Check if fragment exists and belongs to this user
    const fragment = await Fragment.byId(req.user, id);
    
    // Ensure the Content-Type matches the fragment's existing type
    if (fragment.type !== type) {
      logger.warn(`Content type mismatch: fragment is ${fragment.type}, but update is ${type}`);
      return res.status(400).json(
        createErrorResponse(400, 'Content-Type cannot be changed')
      );
    }
    
    // Validate the fragment data
    const rawFragmentData = req.body;
    if (!Buffer.isBuffer(rawFragmentData)) {
      logger.error('Request body is not a Buffer');
      return res.status(415).json(
        createErrorResponse(415, 'Request body must be a valid fragment')
      );
    }
    
    try {
      await validateFragment(rawFragmentData, type);
    } catch (error) {
      logger.error({ error }, 'Validation error');
      return res.status(415).json(
        createErrorResponse(415, `Invalid fragment data: ${error.message}`)
      );
    }
    
    // Update the fragment data
    await fragment.setData(rawFragmentData);
    
    // Return the updated fragment info
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
    logger.error({ err }, 'Error updating fragment');
    
    if (err.message === 'Fragment not found') {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    return res.status(500).json(createErrorResponse(500, 'Unable to update fragment'));
  }
};