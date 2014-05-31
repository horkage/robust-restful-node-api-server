var httpsClient = require('https');
var output = '';

exports.proxy_post_wrapper = function(req, res) {
  var id = req.params['id'];
  var post_data = {"id" : id };
  var content = JSON.stringify(post_data);

  var post_options = {
    host: 'some-host',
    path: '/some-host-endpoint',
    method: 'POST',
    port: '443',
    auth: 'me@me.com:my-password-in-clear-text-yay',
    headers: {
      'content-type' : 'application/json',
      'content-length' : content.length,
      'accept' : 'application/json'
    }
  }

  var creq = httpsClient.request(post_options, function(cres) {
    cres.setEncoding('utf8');
    cres.on('data', function (chunk) {
      output += chunk;
    });
    cres.on('end', function() {
      res.setHeader("Content-Type", "application/json");
      res.end( output ); 
    });
  });

  creq.write( content );
  creq.end();
};
