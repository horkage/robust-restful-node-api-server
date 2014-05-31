var buildLink = function(code, some_other_code, query) {
  var url =  'http://some-host.com/api-endpoint?';
      url += 'key1=';
      url += some_other_code;
      url += '&key2=';
      url += code;
      if (query) {
        url += '&key3=';
        url += encodeURIComponent(query);
      }
  return({
    "constructed_link":url
  });
};

exports.abstract_02 = function(req, res){
  res.send( buildLink( req.params['id'], '1234', req.query['q'] ) );
};
