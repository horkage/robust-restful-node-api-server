/*
 * Routing for some abstract route 02
 *
 * This module serves to separate routing logic from api details.
 *
 */


/* 
 * Load in api implementation details
 */

var api = require('../apis/some_abstract_api_02');
var fs = require('fs');

/* 
 * In order for this middleware to work, we must export this
 * function so that the server that requires this module can
 * pass in the app.  If we don't we cannot use restify's APIs
 */

module.exports = function(app) {

  /* 
   * if you want to crash the app and see exception handling,
   * go here:
   */

  app.get({ path: '/blarf' }, function(req,res) {
    fs.open('/path/to/thing.txt', function(err,fd) {
      //if (err) return err;
      res.end('{"bob":"yay"}');
    });
  });

  app.get({ path: '/abstract_endpoint_02/:id',   version: '1.0.0' }, api.abstract_02);
}
