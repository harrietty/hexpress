const { Buffer } = require('buffer');

function addResMethods(res) {
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };

  res.set = function (prop, val) {
    if (typeof prop === 'object') {
      Object.keys(prop).forEach(p => this.setHeader(p, prop[p]));
    } else if (prop !== undefined && val !== undefined) {
      this.setHeader(prop, val);
    }
  };

  res.send = function (data) {
    if (data instanceof Buffer) {
      data = data.toString();
      if (!this.getHeader('Content-Type')) this.setHeader('Content-Type', 'application/octet-stream');
    } else if (typeof data === 'object') {
      data = JSON.stringify(data);
      if (!this.getHeader('Content-Type')) this.setHeader('Content-Type', 'application/json');
    }
    this.write(data, 'utf8');
    this.end();
  };
  return res;
}

module.exports = addResMethods;