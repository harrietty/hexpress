const {expect} = require('chai');
const matchPaths = require('../lib/matchPaths');

describe.only('matchPaths', function () {
  it('returns empty object when two simple paths match', function () {
    expect(matchPaths('/api', '/api')).to.eql({});
    expect(matchPaths('/api/spells', '/api/spells')).to.eql({});
  });
  it('returns false when two simple paths do not match', function () {
    expect(matchPaths('/api/spells', '/api/hexes')).to.be.false;
    expect(matchPaths('/api/spells', '/api/books')).to.be.false;
  });
  it('returns a parameters object if it matches any params', function () {
    expect(matchPaths('/api/spells/:id', '/api/spells/3')).to.eql({id: '3'});
    expect(matchPaths('/api/spells/:id/:name', '/api/spells/3/foo')).to.eql({id: '3', name: 'foo'});
    expect(matchPaths('/api/magic/:type/spells/:id', '/api/magic/water/spells/6')).to.eql({type: 'water', id: '6'});
  });
  it('returns empty object when the params do not match', function () {
    expect(matchPaths('/api/spells/:id', '/api/foo/spells')).to.eql({});
  });
});