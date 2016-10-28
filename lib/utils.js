'use strict';

// Millisecond range in which our "legacy system" typically responds
const MIN_RES_TIME = 5000;
const MAX_RES_TIME = 10000;

/**
 * Generates a random value between MIN_RES_TIME and MAX_RES_TIME to be used
 * with the intention of creating a deliberate processing delay
 * @return {Number}
 */
exports.getRandomDelay = function () {
  return Math.floor(
    Math.random() * (MAX_RES_TIME - MIN_RES_TIME + 1)
  ) + MIN_RES_TIME;
};
