'use strict';

const env = require('env-var');
const log = require('fh-bunyan').getLogger('weather');
const format = require('util').format;
const VError = require('verror');
const Promise = require('bluebird');
const httpGet = Promise.promisify(require('request').get);

/**
 * Get the weather for a given job
 * @param  {Object}   job
 * @return {Promise}  this will resolve to the weather, or reject with an error
 */
exports.getWeatherForJob = function (job) {
  const url = buildRequestUrl(job);

  log.info('getting weather for job via url %s', url);

  return httpGet({
    url: url,
    json: true
  })
    .then((res) => {
      const sc = res.statusCode;

      if (sc === 200) {
        log.debug(
          'successfully got weather for %s, we\'ve made %s calls today',
          url,
          res.headers['x-forecast-api-calls']
        );
        return res.body;
      } else {
        throw new VError(
          'failed to get weather. status code %s received, and body: %s',
          sc,
          res.body
        );
      }
    });
};


/**
 * Create a valid URL string, e.g api.forecast.com/forecast/YOUR_API_KEY/-53.759378,-21.77393
 * @param  {Object} address
 * @return {String}
 */
function buildRequestUrl (address) {
  return format(
    'https://api.darksky.net/forecast/%s/%s,%s?exclude=minutely,hourly,flags,daily',
    env('DS_API_KEY').required().asString(),
    address.latitude,
    address.longitude
  );
}
