const logger = require('../logger');

// Checks to see whether the fragment Data and the fragment Type match
module.exports.validateFragment = async (fragmentData, fragmentType) => {
  switch (fragmentType) {
    
    case 'text/plain':
      // Ensure the data is a valid text
      validateText(fragmentData);
      break;
    
  }
};
function validateText(fragmentData) {
    console.log('Entered text block');
    if (typeof fragmentData !== 'string' && !Buffer.isBuffer(fragmentData)) {
        logger.error('Invalid text data, must be a string or buffer');
        throw new Error('Invalid text data, must be a string or buffer');
    }
}

