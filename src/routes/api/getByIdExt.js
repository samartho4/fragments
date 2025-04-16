// src/routes/api/getByIdExt.js
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const { createErrorResponse } = require('../../response');
const { convert } = require('../../converter');

/**
 * GET /fragments/:id.:ext
 *
 * Retrieves a single fragment's data for the current user by its id,
 * and converts it to the requested format specified by the extension.
 */
module.exports = async (req, res) => {
  const { id, ext } = req.params;
  
  logger.debug(`GET /fragments/${id}.${ext} (user: ${req.user})`);

  try {
    // Attempt to look up the fragment metadata for this user
    const fragment = await Fragment.byId(req.user, id);

    // Get the raw fragment data
    const data = await fragment.getData();

    // Convert the extension to a proper mime type
    const targetType = extToContentType(ext);
    
    logger.debug(`Converting from ${fragment.mimeType} to ${targetType}`);
    
    // Check if this conversion is supported by looking at the fragment's available formats
    if (!fragment.formats.includes(targetType)) {
      logger.warn(`Unsupported conversion from ${fragment.type} to ${targetType}`);
      return res.status(415).json(
        createErrorResponse(415, `Unsupported conversion from ${fragment.type} to ${targetType}`)
      );
    }

    // Convert the data to the requested type
    try {
      // Make sure we're properly awaiting the conversion
      const convertedData = await convert(data, fragment.mimeType, targetType);
      
      // Return the converted data with appropriate Content-Type
      res.set('Content-Type', targetType);
      res.set('Content-Length', convertedData.length);
      return res.status(200).send(convertedData);
    } catch (conversionError) {
      logger.error({ err: conversionError }, 'Error converting fragment');
      return res.status(500).json(
        createErrorResponse(500, `Error converting fragment: ${conversionError.message}`)
      );
    }
    
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
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'gif': 'image/gif'
  };
  
  return extMap[ext.toLowerCase()] || `application/${ext}`;
}