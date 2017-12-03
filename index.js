const http = require('http');
const url = require('url');

const addResMethods = require('./lib/Response');
const cannotGet = require('./templates/cannotGet');

function hexpress () {
  const nodeServer = http.createServer((req, res) => {
    const {pathname} = url.parse(req.url);
    res = addResMethods(res);
    for (let i = 0; i < app.middlewares.length; i++) {
      const mw = app.middlewares[i];
      if (pathname === mw.path) return mw.handler(req, res);
    }
    for (let i = 0; i < app.errorMiddlewares.length; i++) {
      const mw = app.errorMiddlewares[i];
      return mw(req, res);
    }
  });
  const app = {
    middlewares: [],
    errorMiddlewares: [defaultResponse],
    listen: (...args) => {
      nodeServer.listen(...args);
      return nodeServer;
    },
    get: function (path, handler) {
      this.middlewares.push({
        path,
        method: 'GET',
        handler
      });
    }
  };

  return app;

  function defaultResponse (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.write(cannotGet(req));
    res.end();
  }
}

module.exports = hexpress;