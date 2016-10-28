'use strict';

const log = require('fh-bunyan').getLogger(__filename);
const esb = require('lib/legacy-esb');
const Promise = require('bluebird');
const weather = require('lib/weather');

const route = module.exports = require('express').Router();

// Allows us to get a specific job based on id
route.get('/:jobId', function (req, res, next) {
  esb.getJobWithId(req.params.jobId)
    .then((job) => {
      if (!job) {
        res.status(404).json({
          status: 'job with id ' + req.params.jobId + ' could not be found'
        });
      } else {
        return job;
      }
    })
    .then((job) => res.json(job))
    .catch(next);
});

// Fetches all jobs
route.get('/', function (req, res, next) {
  log.info('received get request for jobs');

  // Fetch jobs and send to the client
  esb.getJobs()
    .then(getWeatherForJobs)
    .tap(function () {
      log.info('got jobs and weather, now responding');
    })
    .then((jobsWithWeather) => res.json(jobsWithWeather))
    .catch(next);
});


/**
 * Given a job, this function will get weather for attach the weather to the job
 * and return the passed in job
 * @param  {Object}   job
 * @return {Promise}  resolves with job once the weather is attached to the job
 */
function attachWeatherToJob (job) {
  return weather.getWeatherForJob(job)
    .then((weatherForJob) => {
      job.weather = weatherForJob;
    })
    .thenReturn(job);
}

/**
 * Takes in the list of jobs and attaches gets the weather for each.
 * @param  {Array}    jobsArray
 * @return {Promise}  resolves passed in jobs, but they now have weather info
 */
function getWeatherForJobs (jobsArray) {
  log.info('got jobs, attaching weather info');
  return Promise.map(jobsArray, attachWeatherToJob, {concurrency: 2});
}