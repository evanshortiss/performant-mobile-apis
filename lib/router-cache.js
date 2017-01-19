'use strict';

// cache instance that our middleware will use
const expeditiousInstance = require('expeditious')({
  namespace: 'httpcache',
  // needs to be set to true if we plan to pass it to express-expeditious
  objectMode: true,
  // Store cache entries for 1 minute
  defaultTtl: 60 * 1000,
  // Store cache entries in node.js memory
  engine: require('expeditious-engine-memory')()
});

module.exports = require('express-expeditious')({
  expeditious: expeditiousInstance
});
