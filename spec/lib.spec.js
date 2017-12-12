const {expect} = require('chai');
const {extractFragments,
  genPathRegex,
  getParams,
  getQueryObj,
  PathObject} = require('../lib/url_path');

describe('Url parser methods', function () {
  describe('extractFragments', function () {
    it('returns null if the path contains no parameters', function () {
      expect(extractFragments('/api/foo')).to.be.null;
    });
    it('returns the fragments of the url when it contains 1 or more params', function () {
      expect(extractFragments('/owners/:id')).to.eql(['/owners/', ':id']);
      expect(extractFragments('/owners/:id/:name')).to.eql(['/owners/', ':id', '/', ':name']);
      expect(extractFragments('/owners/:id/pet/:name')).to.eql(['/owners/', ':id', '/pet/', ':name']);
    });
  });
  
  describe('genPathRegex', function () {
    it('returns null if passed no url fragments', function () {
      expect(genPathRegex()).to.be.null;
    });
    it('turns an array of url fragments into regex to match that path', function () {
      expect(genPathRegex(extractFragments('/api/spells/:id'))).to.eql(/\/api\/spells\/\w+/);
      expect(genPathRegex(extractFragments('/api/spells/:id/foo/:name'))).to.eql(/\/api\/spells\/\w+\/foo\/\w+/);
    });
  });

  describe('getParams', function () {
    it('returns an empty object if it gets no fragments', function () {
      expect(getParams()).to.eql({});
    });
    it('returns an object of the parameters found in a parameterised URL', function () {
      expect(getParams(extractFragments('/api/spells/:id'), '/api/spells/5')).to.eql({
        id: '5'
      });
      expect(getParams(extractFragments('/api/spells/:type/:id'), '/api/spells/earth/5')).to.eql({
        id: '5',
        type: 'earth'
      });
      expect(getParams(extractFragments('/api/spells/:type/ingredients/:id'), '/api/spells/earth/ingredients/5')).to.eql({
        id: '5',
        type: 'earth'
      });
    });
  });
  describe('new PathObject', function () {
    it('returns a new path object when passed a simple URL', function () {
      expect(new PathObject('/api/spells', 'GET')).to.eql({
        path: '/api/spells',
        method: 'GET',
        parameterized: false,
        fragments: null,
        regex: null
      });
    });
    it('returns a new path object when passed a parameterized URL', function () {
      expect(new PathObject('/api/spells/:id', 'GET')).to.eql({
        path: '/api/spells/:id',
        method: 'GET',
        parameterized: true,
        fragments: ['/api/spells/', ':id'],
        regex: genPathRegex(['/api/spells/', ':id'])
      });
    });
  });

  describe('getQueryObj', function () {
    it('returns the correct query object when passed a query', function () {
      expect(getQueryObj('color=black')).to.eql({
        color: 'black'
      });
    });
  });
});