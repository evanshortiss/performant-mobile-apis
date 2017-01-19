'use strict';

const log = require('fh-bunyan').getLogger('text');
const utils = require('lib/utils');
const Promise = require('bluebird');
const db = Promise.promisify(require('fh-mbaas-api').db);

const MESSAGE_STATES = {
  UNSENT: 'unsent',
  SENT: 'sent'
};

const MESSAGE_COLLECTION = 'text-messages';

/**
 * This function pretends it sent a text message and responds with a "success"
 * style JSON response
 * @return {void}
 */
function sendMessage (number, params) {
  log.debug(`attempt to send message "${params.message}" to ${number}`);
  return Promise.delay(utils.getRandomDelay())
    .then(() => {
      log.debug(`message "${params.message}" sent to ${number} successfully`);
    });
}


/**
 * Send a queued message and update its state if done successfully
 * @param  {Object}   msg
 * @return {Promise}
 */
function sendQueuedMessage (msg) {
  return sendMessage(msg.fields.number, msg.fields.params)
    .then(() => {
      // Set state to sent
      msg.fields.state = MESSAGE_STATES.SENT;

      // Mark as sent in mongodb
      return db({
        act: 'update',
        type: MESSAGE_COLLECTION,
        guid: msg.guid,
        fields: msg.fields
      });
    });
}


/**
 * Returns a promise that will resolve with the status of the text operation
 * @return {Promise}
 */
exports.queueMessage = function (number, params) {
  log.info('queuing text to be sent to %s', number);

  // Store the message
  return db({
    act: 'create',
    type: MESSAGE_COLLECTION,
    fields: {
      number: number,
      params: params,
      state: MESSAGE_STATES.UNSENT
    }
  })
    .thenReturn({
      status: `message "${params.message}" will be sent to ${number}`
    });
};


/**
 * Loops over queued messages and sends each.
 * @return {Promise}
 */
exports.sendQueuedMessages = function () {
  log.info('start sending any messages that are queued');

  return db({
    act: 'list',
    type: MESSAGE_COLLECTION,
    eq: {
      state: MESSAGE_STATES.UNSENT
    }
  })
    .then((ret) => Promise.map(ret.list, sendQueuedMessage))
    .then(() => {
      log.info('finished sending all queued messages');
    });
};
