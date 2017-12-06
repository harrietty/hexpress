const http = require('http');
const url = require('url');

const addCustomResMethods = require('./lib/res.methods');
const { errors: { defaultResponse } } = require('./lib/middlewares');
const { getParams,
  PathObject } = require('./lib/url_path');

function Hexpress() {
  this.middlewares = [];
  this.errorMiddlewares = [defaultResponse];
}

Hexpress.prototype.get = function (path, handler) {
  this.middlewares.push({
    path: new PathObject(path, 'GET'),
    handler
  });
};

Hexpress.prototype.post = function (path, handler) {
  this.middlewares.push({
    path: new PathObject(path, 'POST'),
    handler
  });
};

Hexpress.prototype.put = function (path, handler) {
  this.middlewares.push({
    path: new PathObject(path, 'PUT'),
    handler
  });
};

Hexpress.prototype.delete = function (path, handler) {
  this.middlewares.push({
    path: new PathObject(path, 'DELETE'),
    handler
  });
};

Hexpress.prototype.listen = function (...args) {
  const nodeServer = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    const method = req.method;
    res = addCustomResMethods(res);
    for (let i = 0; i < this.middlewares.length; i++) {
      const mw = this.middlewares[i];
      if (mw.path.method === method) {
        if (!mw.path.parameterized && (mw.path.path === pathname)) return mw.handler(req, res);
        else if (!mw.path.parameterized) continue;
        else if (mw.path.regex.test(pathname)) {
          const params = getParams(mw.path.fragments, pathname);
          req.params = params;
          return mw.handler(req, res);
        }
      }
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