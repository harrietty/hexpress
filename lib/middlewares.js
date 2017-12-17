const path = require('path');
const fs = require('fs');
const cannotGet = require('../templates/cannotGet');

function defaultResponse (err, req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.write(cannotGet(req));
  res.end();
}

function static (filePath) {
  return (req, res) => {
    let instancePath = path.join(filePath, req.url);
    fs.readFile(instancePath, (err, contents) => {
      if (err) res.sendStatus(404);
      else res.status(200).send(contents.toString());
    });
  };
}

module.exports = {
  errors: {
    defaultResponse,
  },
  static
};