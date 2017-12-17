const path = require('path');

// TODO: there is probably a good NPM package for this.
function divineContentType(filePath) {
  if (!filePath) return 'text/html';
  const ext = path.extname(filePath);
  switch (ext) {
  case '.html':
    return 'text/html';
  case '.js':
    return 'application/javascript';
  case '.css':
    return 'text/css';
  case '.json':
    return 'application/json';
  default:
    return 'text/plain';
  }
}

// TODO: handle more codes
function getAppropriateTextResponse (code) {
  if (!code) return 'OK';
  switch (code) {
  case 200:
    return 'OK';
  case 201:
    return 'Created';
  case 500:
    return 'Internal Server Error';
  case 418:
    return 'I\'m a teapot';
  case 400:
    return 'Bad Request';
  case 404:
    return 'Not Found';
  case 204:
    return 'No Content';
  }
}

module.exports = {
  divineContentType,
  getAppropriateTextResponse
};