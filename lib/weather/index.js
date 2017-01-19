'use strict';

const env = require('env-var');
const log = require('fh-bunyan').getLogger('weather');
const format = require('util').format;
const VError = require('verror');
const Promise = require('bluebird');
const httpGet = Promise.promisify(require('request').get);
const cache = Promise.promisify(require('fh-mbaas-api').cache);

/**
 * Get the weather for a given job
 * @param  {Object}   job
 * @return {Promise}  this will resolve to the weather, or reject with an error
 */
exports.getWeatherForJob = function (job) {
  const url = buildRequestUrl(job);

  log.info('getting weather for job via url %s', url);

  return loadWeatherFromCache(url)
    .then((weather) => {
      if (weather) {
        log.debug('got weather from cache - %s', url);
        // Weather came from redis - nice!
        return weather;
      } else {
        log.debug('getting weather from ds api - %s', url);
        // Need to get weather from the ds api
        return requestWeather(url)
          .then((weather) => saveWeatherToCache(url, weather));
      }
    });
};


/**
 * Request weather from the dark sky API
 * @param  {String} url
 * @return {Promise}
 */
function requestWeather (url) {
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
}


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


/**
 * Saves a weather JSON object to redis adn returns the weather
 * @param  {String} url
 * @param  {Object} weather
 * @return {Promise}
 */
function saveWeatherToCache (url, weather) {
  log.debug('save weather to cache %s', url);
  return cache({
    act: 'save',
    key: url,
    value: JSON.stringify(weather)
  })
    .thenReturn(weather)
    .catch(() => {
      log.warn('failed to cache weather for request %s', url);
      return weather;
    });
}


/**
 * Loads the weather JSON from redis
 * @param  {String} url
 * @return {Promise}
 */
function loadWeatherFromCache (url) {
  log.debug('load weather from cache %s', url);
  return cache({
    act: 'load',
    key: url
  })
    .then((ret) => {
      if (ret) {
        return JSON.parse(ret);
      }
    });
}
