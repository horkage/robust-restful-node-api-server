/*
 * Logging service (Bunyan)
 *
 * Send debug level stuff to stdout
 * send info+ and error+ levels to files
 *
 * For Bunyan reference see:
 * https://www.npmjs.org/package/bunyan
 * 
 * For Bunyan + Restify reference, see:
 * http://blog.nodejs.org/2012/03/28/service-logging-in-json-with-bunyan/
 *
 * Bunyan log-level quick reference:
 *   trace  10
 *   debug  20
 *   info   30
 *   warn   40
 *   error  50
 *   fatal  60
 *
 * Bunyan object write-reference:
 *   field=>object for bunyan log output
 *   log.info({widget: mywidget}, ...)
 */


var Logger = require('../node_modules/restify/node_modules/bunyan/lib/bunyan');

var mylog  = new Logger({
  name: 'some-api-app',
  streams: [
    {
      level: 'debug',
      stream: process.stdout
    },
    {
      level: 'info',
      path: 'logs/info.log'
    },
    {
      level: 'error',
      path: 'logs/error.log'
    }
  ]
});

module.exports = mylog;
