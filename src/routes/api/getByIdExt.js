// src/routes/api/getByIdExt.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');
const { convert } = require('../../converter');

/**
 * GET /fragments/:id with optional extension
 *
 * Retrieves a single fragment's data for the current user by its id,
 * optionally converting to a different format using extension.
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  const ext = req.params.ext;
  
  logger.debug(`GET /fragments/${id}${ext ? `.${ext}` : ''} (user: ${req.user})`);

  try {
    // Attempt to look up the fragment metadata for this user
    const fragment = await Fragment.byId(req.user, id);

    // Get the raw fragment data
    const data = await fragment.getData();

    // If there's no extension, return the raw data with the original Content-Type
    if (!ext) {
      res.set('Content-Type', fragment.type);
      res.set('Content-Length', data.length);
      return res.status(200).send(data);
    }

    // If we have an extension, we need to convert the data
    const targetType = extToContentType(ext);
    
    // Check if this conversion is supported
    if (!fragment.formats.includes(targetType)) {
      logger.warn(`Unsupported conversion from ${fragment.type} to ${targetType}`);
      return res.status(415).json(
        createErrorResponse(415, `Unsupported conversion from ${fragment.type} to ${targetType}`)
      );
    }

    // Convert the data to the requested type
    const convertedData = convert(data, fragment.mimeType, targetType);
    
    // Return the converted data with appropriate Content-Type
    res.set('Content-Type', targetType);
    res.set('Content-Length', convertedData.length);
    return res.status(200).send(convertedData);
    
  } catch (err) {
    logger.error({ err }, 'Error processing fragment request');
    
    if (err.message === 'Fragment not found') {
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    return res.status(500).json(createErrorResponse(500, 'Server error processing fragment'));
  }
};

/**
 * Convert file extension to Content-Type
 * @param {string} ext - file extension (e.g., 'txt', 'html', 'md')
 * @returns {string} corresponding Content-Type
 */
function extToContentType(ext) {
  const extMap = {
    'txt': 'text/plain',
    'text': 'text/plain',
    'html': 'text/html',
    'md': 'text/markdown',
    'json': 'application/json',
    /*'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'gif': 'image/gif'*/
  };
  
  return extMap[ext] || `application/${ext}`;
}