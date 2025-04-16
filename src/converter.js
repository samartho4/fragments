// src/converter.js

const logger = require('./logger');

/**
 * Convert a fragment's data from one format to another
 * @param {Buffer} data - the fragment data
 * @param {string} sourceType - the source MIME type
 * @param {string} targetType - the target MIME type
 * @returns {Promise<Buffer>} - the converted data
 */
async function convert(data, sourceType, targetType) {
  // If the source and target types are the same, return the data as is
  if (sourceType === targetType) {
    return data;
  }

  logger.debug(`Converting from ${sourceType} to ${targetType}`);

  // Handle text/markdown to text/html conversion
  if (sourceType === 'text/markdown' && targetType === 'text/html') {
    return convertMarkdownToHtml(data);
  }

  // Handle text/plain to text/html conversion
  if (sourceType === 'text/plain' && targetType === 'text/html') {
    return Buffer.from(`<html><body><pre>${data.toString()}</pre></body></html>`);
  }

  // Handle text/* to text/plain conversion
  if (sourceType.startsWith('text/') && targetType === 'text/plain') {
    return Buffer.from(data.toString());
  }

  // Handle application/json to text/plain conversion
  if (sourceType === 'application/json' && targetType === 'text/plain') {
    return Buffer.from(data.toString());
  }

  // Handle image format conversions
  if (sourceType.startsWith('image/') && targetType.startsWith('image/')) {
    return await convertImage(data, sourceType, targetType);
  }

  // If we don't know how to convert this, throw an error
  throw new Error(`Unsupported conversion from ${sourceType} to ${targetType}`);
}

/**
 * Convert Markdown to HTML
 * @param {Buffer} data - the markdown content as a Buffer
 * @returns {Buffer} - HTML content as a Buffer
 */
function convertMarkdownToHtml(data) {
  // Simple markdown conversion, handling headings, paragraphs, and basic formatting
  const markdown = data.toString();
  const lines = markdown.split('\n');
  let html = '<html><body>\n';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      html += `<h1>${line.slice(2)}</h1>\n`;
    } else if (line.startsWith('## ')) {
      html += `<h2>${line.slice(3)}</h2>\n`;
    } else if (line.startsWith('### ')) {
      html += `<h3>${line.slice(4)}</h3>\n`;
    } else if (line.length > 0) {
      html += `<p>${line}</p>\n`;
    } else if (i < lines.length - 1 && lines[i+1].trim().length > 0) {
      html += '\n';
    }
  }

  html += '</body></html>';
  return Buffer.from(html);
}

/**
 * Convert image from one format to another
 * @param {Buffer} data - the image data
 * @param {string} sourceType - source MIME type
 * @param {string} targetType - target MIME type
 * @returns {Promise<Buffer>} - converted image data
 */
async function convertImage(data, sourceType, targetType) {
  try {
    logger.debug(`Converting image from ${sourceType} to ${targetType}`);
    
    // Make sure we have a Buffer
    if (!Buffer.isBuffer(data)) {
      logger.debug('Image data is not a Buffer, converting');
      data = Buffer.from(data);
    }
    
    logger.debug(`Image data size: ${data.length} bytes`);
    
    // Use sharp to convert the image
    const sharp = require('sharp');
    const image = sharp(data);
    
    // Get the target format from the MIME type
    const targetFormat = targetType.split('/')[1];
    logger.debug(`Target format: ${targetFormat}`);
    
    let result;
    
    switch (targetFormat) {
      case 'jpeg':
        result = await image.jpeg().toBuffer();
        break;
      case 'png':
        result = await image.png().toBuffer();
        break;
      case 'webp':
        result = await image.webp().toBuffer();
        break;
      case 'gif':
        result = await image.gif().toBuffer();
        break;
      default:
        throw new Error(`Unsupported image format: ${targetFormat}`);
    }
    
    logger.debug(`Conversion successful, output size: ${result.length} bytes`);
    return result;
  } catch (err) {
    logger.error({ err }, 'Error converting image');
    throw new Error(`Error converting image: ${err.message}`);
  }
}

module.exports.convert = convert;
module.exports.convertMarkdownToHtml = convertMarkdownToHtml;
module.exports.convertImage = convertImage;