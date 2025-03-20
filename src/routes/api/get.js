// src/routes/api/get.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
async function getFragmentsList(req, res) {
  try {
    // Fetch the expanded list of objects if the user opts for it
    if (req.query.expand === '1') {
      /*logger.info('Fetching all the expanded fragments for user');
      const fragments = await Fragment.byUser(req.user, true);
      logger.info('List of expanded fragments fetched successfully');

      res.status(200).send(
        createSuccessResponse({
          fragments: fragments,
        })
      );*/
    } else {
      logger.info('Fetching list of fragment IDs for user');
      // Otherwise, send the array of fragment IDs to the user
      const fragments = await Fragment.byUser(req.user, false);
      logger.info('List of fragment IDs fetched successfully');

      res.status(200).send(
        createSuccessResponse({
          fragments: fragments,
        })
      );
    }
  } catch (error) {
    // Catch any errors that occur during the fragment fetching process
    logger.error('An error occurred while fetching the list of fragments for user:', error.message);
    res.status(500).send(createErrorResponse(500, 'Internal Server Error'));
  }
}

module.exports = {
  getFragmentsList
};