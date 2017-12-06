function matchPaths (parameterised, actual) {
  if (!parameterised.includes(':')) return parameterised === actual ? {} : false;
  const pathFragments = parameterised.match(/[:][\w\d]+|[\w/]+/g);

  console.log(pathFragments);

  const regex = new RegExp(pathFragments.map(frag => {
    if (frag[0] === ':') return '\\w+';
    else return frag;
  }).join(''));
  if (!regex.test(actual)) return {};

  const paramsObj = {};
  pathFragments.forEach(fragment => {
    if (fragment[0] === ':') {
      paramsObj[fragment.slice(1)] = actual.slice(0, actual.indexOf('/') === -1 ? actual.length : actual.indexOf('/'));
      actual = actual.replace(paramsObj[fragment.slice(1)], '');
    } else {
      actual = actual.replace(fragment, '');
    }
    console.log(actual);
  });
  return paramsObj;
}

module.exports = matchPaths;