/*
 * Routing for some abstract route 01
 *
 * This module serves to separate routing logic from api details.
 *
 */


/* 
 * Load in api implementation details
 */

var api = require('../apis/some_abstract_api_01');


/* 
 * In order for this middleware to work, we must export this
 * function so that the server that requires this module can
 * pass in the app.  If we don't we cannot use restify's APIs
 */

module.exports = function(app) {
  app.get({ path: '/abstract_endpoint_01/:id',   version: '1.0.0' }, api.proxy_post_wrapper);
}
