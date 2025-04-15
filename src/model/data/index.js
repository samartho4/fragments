// src/model/data/index.js
// eslint-disable-next-line no-unused-vars
const s3Client = require('./aws/s3Client');
// eslint-disable-next-line no-unused-vars
const ddbDocClient = require('./aws/ddbDocClient');


module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');