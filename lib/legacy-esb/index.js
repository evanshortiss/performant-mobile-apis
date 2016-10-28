'use strict';

const log = require('fh-bunyan').getLogger('esb');
const utils = require('lib/utils');
const Promise = require('bluebird');

/**
 * Returns dummy data from a JSON file we have inside this project
 * @return {Array}
 */
function readJobs () {
  log.info('making request to ESB for jobs');

  // Simulate the delay of a SOAP or database call to a legacy system
  return Promise.delay(utils.getRandomDelay())
    .then(function () {
      return require('data/jobs.json');
    });
}


/**
 * Get a job with a given ID
 * @param  {String}   id
 * @return {Promise}
 */
exports.getJobWithId = function (id) {
  return readJobs()
    .then((jobs) => {

      log.info('finding job %s in returned jobs', id);

      // Find the job and return it
      for (var i in jobs) {
        if (jobs[i]._id === id) {
          return jobs[i];
        }
      }

      // Job not found :(
      return null;

    });
};


/**
 * Returns a promise that will resolve with a list of jobs after a random delay
 * @return {Promise}
 */
exports.getJobs = function () {
  return readJobs();
};
