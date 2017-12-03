const http = require('http');

const cannotGet = require('./templates/cannotGet');

function hexpress () {
  const nodeServer = http.createServer((req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.write(cannotGet(req));
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