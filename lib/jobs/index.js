'use strict';

const CronJob = require('cron').CronJob;

const messageJob = new CronJob({
  onTick: require('lib/text').sendQueuedMessages,
  start: false,
  cronTime: '* * * * *'
});


/**
 * Start all jobs ticking so that they continuously run at the desired time
 * @return {void}
 */
exports.startJobs = function () {
  messageJob.start();
};
