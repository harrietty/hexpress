const { Buffer } = require('buffer');
const fs = require('fs');
const {divineContentType, getAppropriateTextResponse} = require('../lib/helpers');

function addResMethods(res) {
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };

  res.sendStatus = function (code) {
    this.statusCode = code;
    this.set('Content-Type', 'text/plain');
    this.write(getAppropriateTextResponse(code));
    this.end();
  };

  res.set = function (prop, val) {
    if (typeof prop === 'object') {
      Object.keys(prop).forEach(p => this.setHeader(p, prop[p]));
    } else if (prop !== undefined && val !== undefined) {
      this.setHeader(prop, val);
    }
  };

  res.send = function (data) {
    if (!this.statusCode) this.statusCode = 200;
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

  res.sendFile = function (filePath) {
    fs.readFile(filePath, (err, contents) => {
      this.setHeader('Content-Type', divineContentType(filePath));
      this.send(contents.toString());
    });
  };
  return res;
}

module.exports = addResMethods;