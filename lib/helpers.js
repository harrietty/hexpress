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

module.exports = {
  divineContentType
};