const cannotGet = require('../templates/cannotGet');

function defaultResponse (req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.write(cannotGet(req));
  res.end();
}

module.exports = {
  errors: {
    defaultResponse
  }
};