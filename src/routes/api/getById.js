// src/routes/api/getById.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * GET /fragments/:id
 *
 * Retrieves a single fragment’s data for the current user by its id.
 * Only plain text is supported for now (i.e., text/plain).
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug(`GET /fragments/${id} (user: ${req.user})`);

  let fragment;
  try {
    // Attempt to look up the fragment metadata for this user
    fragment = await Fragment.byId(req.user, id);
  } catch (err) {
    logger.error({ err }, 'Error looking up fragment');
    return res
      .status(404)
      .json(createErrorResponse(404, 'Fragment not found'));
  }

  // If no fragment is found, return 404
  if (!fragment) {
    return res
      .status(404)
      .json(createErrorResponse(404, 'Fragment not found'));
  }

  // We only want to support plain text for now
  if (!fragment.type.startsWith('text/plain')) {
    logger.warn(`Fragment type ${fragment.type} is not supported for plain text retrieval`);
    return res
      .status(415)
      .json(createErrorResponse(415, 'Only text/plain fragments can be retrieved at this time'));
  }

  // Retrieve the raw data from storage
  let data;
  try {
    data = await fragment.getData();
  } catch (err) {
    logger.error({ err }, 'Error getting fragment data');
    return res
      .status(404)
      .json(createErrorResponse(404, 'Fragment data not found'));
  }

  // Return the data as text/plain
  res.set('Content-Type', fragment.type);
  res.set('Content-Length', data.length);
  return res.status(200).send(data);
};
