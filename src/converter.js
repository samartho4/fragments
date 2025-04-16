// src/converter.js

const logger = require('./logger');
const sharp = require('sharp');

/**
 * Convert a fragment's data from one format to another
 * @param {Buffer} data - the fragment data
 * @param {string} sourceType - the source MIME type
 * @param {string} targetType - the target MIME type
 * @returns {Promise<Buffer>} - the converted data
 */
async function convert(data, sourceType, targetType) {
  // Add validation for parameters
  if (!data || !sourceType || !targetType) {
    throw new Error('Missing required parameters: data, sourceType, and targetType are all required');
  }
  
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

  // If we reach here, the conversion is not supported
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
 * @param {Buffer} data - the image data as a Buffer
 * @param {string} sourceType - the source image MIME type
 * @param {string} targetType - the target image MIME type
 * @returns {Promise<Buffer>} - converted image as a Buffer
 */
async function convertImage(data, sourceType, targetType) {
  try {
    logger.debug(`Converting image from ${sourceType} to ${targetType}`);
    
    const image = sharp(data);
    
    // Extract the image format from the MIME type (e.g., 'image/png' -> 'png')
    const targetFormat = targetType.split('/')[1];
    
    logger.debug(`Target format: ${targetFormat}`);
    
    // Convert to the target format
    switch (targetFormat) {
      case 'jpeg':
        return await image.jpeg().toBuffer();
      case 'png':
        return await image.png().toBuffer();
      case 'webp':
        return await image.webp().toBuffer();
      case 'gif':
        return await image.gif().toBuffer();
      default:
        throw new Error(`Unsupported image format: ${targetFormat}`);
    }
  } catch (err) {
    logger.error({ err }, 'Image conversion error');
    throw err;
  }
}

module.exports.convert = convert;
module.exports.convertMarkdownToHtml = convertMarkdownToHtml;
module.exports.convertImage = convertImage;