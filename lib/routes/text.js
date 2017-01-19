'use strict';

const log = require('fh-bunyan').getLogger(__filename);
const text = require('lib/text');

const route = module.exports = require('express').Router();

// If a request contains JSON in the body then parse it and add to req.body
route.use(require('body-parser').json());

route.post('/:number', function (req, res, next) {
  const number = req.params.number;

  if (!req.body.message) {
    return res.status(400).json({
      status: 'please include a "message" in the request body'
    });
  }

  text.queueMessage(number, req.body)
    .tap(function () {
      log.info('sucessfully queued text to be sent to %s', number);
    })
    .then((status) => res.json(status))
    .catch(next);
});
