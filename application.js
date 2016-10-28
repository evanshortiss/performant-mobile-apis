'use strict';

const express = require('express');
const mbaasApi = require('fh-mbaas-api');
const mbaasExpress = mbaasApi.mbaasExpress();
const cors = require('cors');
const log = require('fh-bunyan').getLogger('application');

const app = express();

// Enable CORS for all requests
app.use(cors());

// Returns a response time header to easily determine request processing time
app.use(require('response-time')());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// Our jobs API for our mobile application, allows us to GET all, or by ID
app.use('/jobs', require('lib/routes/jobs'));
// Texting API, allows devices to send a text to a number
app.use('/text', require('lib/routes/text'));

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8009;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function () {
  log.info('App started at: %s on port: %s', new Date(), port);
});
