// src/converter.js

const logger = require('./logger');

/**
 * Convert a fragment's data from one format to another
 * @param {Buffer} data - the fragment data
 * @param {string} sourceType - the source MIME type
 * @param {string} targetType - the target MIME type
 * @returns {Buffer} - the converted data
 */
function convert(data, sourceType, targetType) {
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

  // If we don't know how to convert this, throw an error
  throw new Error(`Unsupported conversion from ${sourceType} to ${targetType}`);
}

/**
 * Convert Markdown to HTML
 * @param {Buffer} data - the markdown content as a Buffer
 * @returns {Buffer} - HTML content as a Buffer
 */
function convertMarkdownToHtml(data) {
  // Very simple markdown conversion, just handle headings and paragraphs for now
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

module.exports.convert = convert;
module.exports.convertMarkdownToHtml = convertMarkdownToHtml;