'use strict';

const express = require('express');
const mbaasApi = require('fh-mbaas-api');
const mbaasExpress = mbaasApi.mbaasExpress();
const cors = require('cors');
const log = require('fh-bunyan').getLogger('application');

const app = express();

/**
 * Enable CORS for each request. This is not required for all APIs, but is
 * commonly used if you serve a webapp from a.com, but run this API on b.com.
 * Read more here: https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 */
app.use(cors());

app.use(require('compression')());

// Returns a response time header to easily determine request processing time
app.use(require('response-time')());

// Middleware required to run this application on a Red Hat Mobile Application
// Platform instance
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);
app.use(mbaasExpress.fhmiddleware());

// Our jobs API for our mobile application, allows us to GET all, or by ID
app.use('/jobs', require('lib/routes/jobs'));
// Texting API, allows devices to send a text to a number
app.use('/text', require('lib/routes/text'));

// An express error handler
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8009;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function (err) {
  if (err) {
    throw err;
  }
  log.info('App started at: %s on port: %s', new Date(), port);
});
