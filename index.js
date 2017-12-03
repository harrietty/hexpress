const http = require('http');

function hexpress () {
  const nodeServer = http.createServer((req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.write('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot GET /</pre>\n</body>\n</html>\n');
    res.end();
  });
  const app = {
    listen: (...args) => {
      nodeServer.listen(...args);
      return nodeServer;
    }
  };
  return app;
}

module.exports = hexpress;