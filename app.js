/*
 * Use restify instead of Expressjs
 */

var restify     = require('restify')      // "proper" RESTful framework
  , cluster     = require('cluster')      // multi-core node with child resilience
  , util        = require('util')
  , domain      = require('domain')       // "Correct" way of handling node exceptions
  , querystring = require('querystring')
  , log         = require('./lib/logger')
  , mongoose    = require('mongoose')

var numCPUs = require('os').cpus().length
var PORT    = +process.env.PORT || 8080


/*
 * Define REST server
 */

var server = restify.createServer({
  name: 'RESTful Server [' + process.pid + ']',
  version: '1.0.0',
  log: log
});


/*
 * Middleware Start
 */

/*
 * LOG ALL THE THINGS (note the pre())
 */

server.pre(function (request, response, next) {
  request.log.info('info: %s', '[' + request.method + '] ' + request.url);
  return next();
});

/*
 * Wrap server in domain so it is more resilient against
 * exceptions crashing the whole app
 */

server.use(function(req, res, next) {
  var serverDomain = domain.create();
  serverDomain.add(req);
  serverDomain.add(res);
  serverDomain.on('error', function(err) {
    req.log.error(req, err);
    try {
      var killtimer = setTimeout(function() {
        process.exit(1);
      }, 10000);
      killtimer.unref();

      server.close();

      cluster.worker.disconnect();
      res.statusCode = 500;
      res.setHeader('content-type', 'text/plain');
      res.end('Internal Server Error');
    } catch (er2) {
      req.log.fatal(req, er2);
      process.abort();
    }
  });
  serverDomain.run(next);
});

/* 
 * All requests will need access to query strings
 */

server.use(restify.queryParser());

/*
 * Load the routes, which in turn, load their apis
 */

require('./routes/some_abstract_route_01')(server);
require('./routes/some_abstract_route_02')(server);

/*
 * Middleware End
 */




/*
 * Fire it up
 */

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('disconnect', function(worker) {
    log.warn( 'child process ' + '[' + process.pid + ']' + ' disconnected!');
    cluster.fork();
  });
} else {
  server.listen(PORT, function() {
    log.info('%s started on %s', server.name, server.url);
  });
}
