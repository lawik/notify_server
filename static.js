var static = require('node-static')
  , util = require('util')
  , http = require('http');

var webroot = './public'
  , port = 4434;

var file = new(static.Server)(webroot, {
  cache: 3600,
});

http.createServer(function(req, res) {
  req.addListener('end', function() {
    file.serve(req, res, function(err, result) {
      if (err) {
        console.error('Error serving %s - %s', req.url, err.message);
        if (err.status === 404 || err.status === 500) {
          file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
        } else {
          res.writeHead(err.status, err.headers);
          res.end();
        }
      } else {
        console.log('%s - %s', req.url, res.message);
      }
    });
  });
}).listen(port);

console.log('node-static running at http://localhost:%d', port);
