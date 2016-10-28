'use strict';

const log = require('fh-bunyan').getLogger('text');
const utils = require('lib/utils');
const Promise = require('bluebird');

/**
 * Returns dummy data from a JSON file we have inside this project
 * @return {Array}
 */
function sendMessage (number, params) {
  return {
    status: 'message "' + params.message + '" sent to ' + number
  };
}


/**
 * Returns a promise that will resolve with the status of the text operation
 * @return {Promise}
 */
exports.sendText = function (number, params) {
  log.info('sending text to %s', number);

  // Simulate the delay of an API call to a text messaging service
  return Promise.delay(utils.getRandomDelay())
    .then(function () {
      return sendMessage(number, params);
    });
};
