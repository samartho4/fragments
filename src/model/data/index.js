// src/model/data/index.js
const s3Client = require('./aws/s3Client');
const ddbDocClient = require('./aws/ddbDocClient');

// Export the AWS implementation
module.exports = require('./aws');