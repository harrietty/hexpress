const http = require('http');
const url = require('url');

const addCustomResMethods = require('./lib/res.methods');
const {errors: {defaultResponse}} = require('./lib/middlewares');

function Hexpress () {
  this.middlewares = [];
  this.errorMiddlewares = [defaultResponse];
}

Hexpress.prototype.get = function (path, handler) {
  this.middlewares.push({
    path, method: 'GET', handler
  });
};

Hexpress.prototype.listen = function (...args) {
  const nodeServer = http.createServer((req, res) => {
    const {pathname} = url.parse(req.url);
    res = addCustomResMethods(res);
    for (let i = 0; i < this.middlewares.length; i++) {
      const mw = this.middlewares[i];
      if (pathname === mw.path) return mw.handler(req, res);
    }
    for (let i = 0; i < this.errorMiddlewares.length; i++) {
      const mw = this.errorMiddlewares[i];
      return mw(req, res);
    }
  });

  nodeServer.listen(...args);
  return nodeServer;
};

module.exports = Hexpress;