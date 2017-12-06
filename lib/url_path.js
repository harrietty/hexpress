function extractFragments (path) {
  if (!path.includes(':')) return null;
  return path.match(/[:][\w\d]+|[\w/]+/g);
}

function genPathRegex (fragments) {
  if (!fragments) return null;
  return new RegExp(fragments.map(frag => {
    if (frag[0] === ':') return '\\w+';
    else return frag;
  }).join(''));
}

function getParams (fragments = [], requestedPath) {
  const paramsObj = {};
  fragments.forEach(fragment => {
    if (fragment[0] === ':') {
      paramsObj[fragment.slice(1)] = requestedPath.slice(0, requestedPath.indexOf('/') === -1 ? requestedPath.length : requestedPath.indexOf('/'));
      requestedPath = requestedPath.replace(paramsObj[fragment.slice(1)], '');
    } else {
      requestedPath = requestedPath.replace(fragment, '');
    }
  });
  return paramsObj;
}

function PathObject (path, method) {
  const fragments = extractFragments(path);

  this.path = path;
  this.method = method;
  this.parameterized = path.includes(':');
  this.fragments = fragments;
  this.regex = genPathRegex(fragments);
}

module.exports = {extractFragments, genPathRegex, getParams, PathObject};